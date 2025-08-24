require("./config")
import {db, bucket} from "./config";
import { Event } from "./models/eventModel";
import { sampleData, PostApify, PostConverter } from "./models/postModel"
import { EventsGeminiApiClient } from "./api/geminiApiClient";
import { FirestoreApiClient } from "./api/firestoreApiClient";
import { Image } from "./models/imageModel";
import fetch from "node-fetch";
import { EventConverter, sampleEvents } from "./models/eventModel";
import { ImageConverter } from "./models/imageModel";
import { getDownloadURL } from "firebase-admin/storage";
import { ApifyApiClient } from "./api/apifyApiClient";

// function to call Apify API
async function getEvents(isDryRun=true){

    // get list of artists to query for
    const artistsCollection = db.collection("artists")
    const firestoreClient = new FirestoreApiClient(artistsCollection)
    const artists = await firestoreClient.getAllDocs()

    console.log(artists)

    const artistUrls = artists.map((artist) => {
        return artist.instagramSourceURL
    }).filter((url) => url != null && url.trim() != "")

    const apiKey = process.env.APIFY_API_KEY || ""
    const apifyClient = new ApifyApiClient(apiKey);

    const batchedArtistUrls = apifyClient.batchInput(artistUrls)
    const actorInputs = batchedArtistUrls.map((urls) => apifyClient.generateActorInput(urls))

    console.log(actorInputs)

    if (!isDryRun){

        // batch fetch

        // const schedulePosts = apifyClient.fetchSchedulePosts(actorInput)
        // return schedulePosts
        const schedulePosts = await apifyClient.batchFetchSchedulePosts(actorInputs) as PostApify[]

        for (const post of schedulePosts){
            await uploadPost(post)
        }

        return schedulePosts
    }
    else{
        return []
    }

}

async function uploadPost(post: PostApify) {

    // check if a post with the same url exists
    const postConverter = new PostConverter();
    const postJson = postConverter.toFirestore(post);
    const postsCollectionRef = db.collection('posts');

    const query = postsCollectionRef
        .where("url", "==", post.url);

    const querySnapshot = await query.get();
    if (querySnapshot.empty) {
        // add the post
        postsCollectionRef.doc(post.id).set(postJson).then((docRef) => {
            console.log(`Post added with ID: ${post.id} at ${docRef.writeTime.toDate()}`);
        })
    } else {
        // update the existing post
        const existingDocId = querySnapshot.docs[0].id;
        postsCollectionRef.doc(existingDocId).update(postJson as object).then(() => {
            console.log(`Post with ID: ${existingDocId} updated.`);
        })

    }
}

//getEvents(false)
// getEvents()

// function to parse events from posts using Gemini
async function parseEvents(posts: PostApify[]){    

    for (const post of posts) {

        // initiate a transaction. If any of the post information doesn't upload, abandon the process
        await db.runTransaction(async (t) => {

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

                    if (events.length > 0) {
                        //normalize the artist name
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

                            // TODO: add second round of geocoding through the Google Maps API?

                            event.ownerUsername = post.ownerUsername; // set the owner username from the post
                            event.imageDocIDs = [newImageDocId];
                            event.imageDisplayURLs = [image.firebaseDisplayURL ?? ""];
                            if (event.endDate == null){
                                event.endDate == event.startDate
                            }
                        });

                        // for each event, save the event info into Firestore
                        for (const event of events) {

                            uploadEvent(event).catch(console.error);
                        }
                    }
                }
            } 
            else {
                // Already parsed and saved this post. Skip to the next one
                console.log(`Images from post ${post.url} already parsed and saved.`);
            }

        })

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

    }
}

// getEvents();

// const posts = sampleData.map(data => new PostApify(data));
// const schedulePosts = posts.filter(post => post.isSchedule());
// parseEvents(schedulePosts);

sampleData
getEvents(false).then((posts) => {
    parseEvents(posts)
})