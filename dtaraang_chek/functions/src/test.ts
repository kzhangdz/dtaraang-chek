require("./config")
import {db, bucket} from "./config";
import { sampleData, PostApify } from "./models/postModel"
import { EventsGeminiApiClient } from "./api/geminiApiClient";
import { FirestoreApiClient } from "./api/firestoreApiClient";
import { Image } from "./models/imageModel";
import fetch from "node-fetch";
import { EventConverter, sampleEvents } from "./models/eventModel";
import { ImageConverter } from "./models/imageModel";
import { getDownloadURL } from "firebase-admin/storage";

// function to call Apify API

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
                const geminiApiKey = process.env.GEMINI_API_KEY || "";
                const geminiApiClient = new EventsGeminiApiClient(geminiApiKey);
                const imageParts = [geminiApiClient.fileBufferToGenerativePart(fileBuffer, "image/jpeg")];
                imageParts
                const events = await geminiApiClient.parseImageForEvents(imageParts)

                // test
                //const events = sampleEvents;
                sampleEvents

                if (events.length > 0) {
                    // create the image data
                    const imageData = {
                        artistName: events[0].artistName, // assuming the first event has the artist name
                        instagramPostURL: post.url,
                        instagramPageNumber: i,
                        instagramSourceURL: post.inputUrl,
                        instagramDescription: post.caption
                    };
                    const image = new Image(imageData)

                    // save the image to Storage
                    const folderName = post.ownerUsername;
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
                    const imagesCollectionRef = db.collection(imagesCollection);

                    const imagesFirestoreClient = new FirestoreApiClient(imagesCollectionRef);
                    const newImageDocId = await imagesFirestoreClient.addDoc(imageJson)
                    console.log(`Wrote image ${newImageDocId} to Firestore`);

                    // for each event, save the event info into Firestore
                    for (const event of events) {
                        event.ownerUsername = post.ownerUsername; // set the owner username from the post
                        event.imageDocIDs = [newImageDocId];
                        event.imageDisplayURLs = [image.firebaseDisplayURL];
                        const eventConverter = new EventConverter();
                        const eventJson = eventConverter.toFirestore(event);
                        const eventsCollectionRef = db.collection('events');
                        
                        const eventsFirestoreClient = new FirestoreApiClient(eventsCollectionRef);
                        const newEventDocId = await eventsFirestoreClient.addDoc(eventJson)
                        console.log(`Wrote event ${newEventDocId} to Firestore`);
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

const posts = sampleData.map(data => new PostApify(data));
const schedulePosts = posts.filter(post => post.isSchedule());
parseEvents(schedulePosts);