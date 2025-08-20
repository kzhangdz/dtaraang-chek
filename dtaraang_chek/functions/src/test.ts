require("./config")
import {db, bucket} from "./config";
import { Event } from "./models/eventModel";
import { sampleData, PostApify } from "./models/postModel"
import { EventsGeminiApiClient } from "./api/geminiApiClient";
import { FirestoreApiClient } from "./api/firestoreApiClient";
import { Image } from "./models/imageModel";
import fetch from "node-fetch";
import { EventConverter, sampleEvents } from "./models/eventModel";
import { ImageConverter } from "./models/imageModel";
import { getDownloadURL } from "firebase-admin/storage";

// function to call Apify API

// TODO: wrap each database call in try-catch blocks
// Put all calls inside a transaction as well

// function to parse events from posts using Gemini
async function parseEvents(posts: PostApify[]){

    for (const post of posts) {
        
        // check if an `image` exists with that Instagram link and page number
        const imagesCollection = "images" // TODO: put in constant file

        const imagesRef = db.collection(imagesCollection);
        const query = imagesRef
            .where("instagramPostURL", "==", post.url)

        const querySnapshot = await query.get();
        if (querySnapshot.empty) {
            // start the process to save the info
            const images = post.getImages()

            for (let i = 0; i < images.length; i++) {
                const currentImageUrl = images[i];
                
                // fetch file from the url
                console.log(currentImageUrl);
                const response = await fetch(currentImageUrl);
                if (!response.ok) {
                    console.log(`Failed to fetch file: ${response.statusText}`);
                    break // end fetching for this post
                }

                const fileArrayBuffer = await response.arrayBuffer();
                const fileBuffer = Buffer.from(fileArrayBuffer)

                // initialize Gemini API client
                const geminiApiKey = process.env.GOOGLE_API_KEY || "";
                const geminiApiClient = new EventsGeminiApiClient(geminiApiKey);
                const imageParts = [geminiApiClient.fileBufferToGenerativePart(fileBuffer, "image/jpeg")];
                imageParts
                const adtlPrompt = `The image is from the Instagram post ${post.url} by ${post.ownerUsername}. It was uploaded on ${post.timestamp}`;
                var events = await geminiApiClient.parseImageForEvents(imageParts, adtlPrompt)

                // test
                //const events = sampleEvents;
                sampleEvents

                // TODO: function to normalize the artist name

                if (events.length > 0) {
                    events = await normalizeArtistName(events)

                    // create the image data
                    const imageData = {
                        artistName: events[0].artistName, // assuming the first event has the artist name
                        instagramPostURL: post.url,
                        instagramPageNumber: i,
                        instagramSourceURL: post.inputUrl,
                        instagramDescription: post.caption,
                        ownerUsername: post.ownerUsername
                    };
                    const image = new Image(imageData)

                    // save the image to Storage
                    const newImageDocId = await uploadImage(image, fileBuffer);

                    // update the events with the ownerUsername, image doc ID, display URL
                    events.forEach(event => {
                        event.ownerUsername = post.ownerUsername; // set the owner username from the post
                        event.imageDocIDs = [newImageDocId];
                        event.imageDisplayURLs = [image.firebaseDisplayURL ?? ""];
                    });

                    // for each event, save the event info into Firestore
                    for (const event of events) {
                        // event.ownerUsername = post.ownerUsername; // set the owner username from the post
                        // event.imageDocIDs = [newImageDocId];
                        // event.imageDisplayURLs = [image.firebaseDisplayURL];
                        
                        // const eventConverter = new EventConverter();
                        // const eventJson = eventConverter.toFirestore(event);
                        // const eventsCollectionRef = db.collection('events');
                        
                        // const eventsFirestoreClient = new FirestoreApiClient(eventsCollectionRef);
                        // const newEventDocId = await eventsFirestoreClient.addDoc(eventJson)
                        // console.log(`Wrote event ${newEventDocId} to Firestore`);

                        uploadEvent(event).catch(console.error);
                    }
                }
            }
        } 
        else {
            // Already parsed and saved this post. Skip to the next one
            console.log(`Images from post ${post.url} already parsed and saved.`);
            continue
        }

    }
}

async function normalizeArtistName(events: Event[]): Promise<Event[]> {

    if (events.length > 0){
        // find the associated artist document in Firestore
        const artistsCollection = db.collection('artists');
        const query = artistsCollection
            .where("artistName", "==", events[0].artistName.toLowerCase());

        const querySnapshot = await query.get();
        if (querySnapshot.empty) {
            console.log(`No artist found for username ${events[0].artistName}`);
            return events; // return the events as is
        }

        const artistDoc = querySnapshot.docs[0];
        const artistData = artistDoc.data();
        
        // update the artist name in the events
        events.forEach(event => {
            event.artistName = artistData.displayName;
        });
    }
    return events
}

async function uploadImage(image: Image, fileBuffer: Buffer): Promise<string> {
    
    // save the image to Storage
    const folderName = image.artistName;
    const fileName = image.getFileName();
    const storagePath = `artists/${folderName}/${fileName}`
    const fileRef = bucket.file(storagePath)
    await fileRef.save(fileBuffer).then(() => {
        console.log(`File saved to ${storagePath}`);
    })

    // get download URL
    const downloadUrl = await getDownloadURL(fileRef);
    console.log(downloadUrl)
    // set download URL
    image.firebaseDisplayURL = downloadUrl;

    // save the image to Firestore
    const imageConverter = new ImageConverter();
    const imageJson = imageConverter.toFirestore(image);
    const imagesCollectionRef = db.collection('images');

    const imagesFirestoreClient = new FirestoreApiClient(imagesCollectionRef);
    const newImageDocId = await imagesFirestoreClient.addDoc(imageJson)
    console.log(`Wrote image ${newImageDocId} to Firestore`);

    return newImageDocId;
}

// add the event if no other event with the same name and instagram owner username exists
// otherwise, update the existing event with the new image
async function uploadEvent(event: Event) {
    // TODO: check artists collection to replace the artist name with the display name. can use a lowercase check 

    // check if an event with the same name and instagram owner username exists
    const eventConverter = new EventConverter();
    const eventJson = eventConverter.toFirestore(event);
    const eventsCollectionRef = db.collection('events');

    const query = eventsCollectionRef
        .where("eventName", "==", event.eventName)
        .where("ownerUsername", "==", event.ownerUsername)
        .where("startDate", "==", event.startDate);

    const querySnapshot = await query.get();
    if (querySnapshot.empty) {
        // add the event
        eventsCollectionRef.add(eventJson).then((docRef) => {
            console.log(`Event added with ID: ${docRef.id}`);
        })
    } else {
        // update the existing event with the new image
        const existingEventDocId = querySnapshot.docs[0].id;
        eventsCollectionRef.doc(existingEventDocId).update(eventJson as object).then(() => {
            console.log(`Event with ID: ${existingEventDocId} updated.`);
        })

        // const existingEventDoc = querySnapshot.docs[0];
        // const existingEventData = existingEventDoc.data() as EventDbModel;
        // const updatedEventData: EventDbModel = {
        //     ...eventJson,
        //     imageDocIDs: [...(existingEventData.imageDocIDs || []), ...(event.imageDocIDs || [])],
        //     imageDisplayURLs: [...(existingEventData.imageDisplayURLs || []), ...(event.imageDisplayURLs || [])]
        // };
    }
    
    // const eventsFirestoreClient = new FirestoreApiClient(eventsCollectionRef);
    // const newEventDocId = await eventsFirestoreClient.addDoc(eventJson)
    // console.log(`Wrote event ${newEventDocId} to Firestore`);
}

const posts = sampleData.map(data => new PostApify(data));
const schedulePosts = posts.filter(post => post.isSchedule());
parseEvents(schedulePosts);