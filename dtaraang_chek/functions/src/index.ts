/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// close all emulators
// taskkill /f /im java.exe

import { getApps, initializeApp } from 'firebase-admin/app';
//import {onSchedule} from "firebase-functions/v2/scheduler";
import vision from '@google-cloud/vision';
//import * as tesseract from "node-tesseract-ocr";
import {onObjectFinalized} from "firebase-functions/v2/storage";
//import {getStorage} from "firebase-admin/storage";
import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

if (!getApps().length) initializeApp(); // <-- this was missing

// export const parseImages = onSchedule("every day 00:00", async (event) =>{
    
// });

// onCreate function for Storage?
// export const parseImage = onObjectFinalized(async (event) => {
//     const fileBucket = event.data.bucket; // Storage bucket containing the file.
//     const filePath = event.data.name; // File path in the bucket.
//     //const contentType = event.data.contentType; // File content type.

//     // Download file into memory from bucket.
//     const bucket = getStorage().bucket(fileBucket);
//     const downloadResponse = await bucket.file(filePath).download();
//     const imageBuffer = downloadResponse[0];
//     logger.log("Image downloaded!");

//     // Parse the image text using tesseract
//     const config = {
//         lang: 'th+eng'
//     }
//     // Use Tesseract to recognize text from the image
//     tesseract.recognize(imageBuffer, config)
//         .then((text) => {
//         logger.info('OCR Result:', text);
//         })
//         .catch((error) => {
//         logger.error('OCR Error:', error.message);
//         //res.status(500).send('Error processing the image.');
//         });
// });

//get text blocks
//https://stackoverflow.com/questions/57071788/google-vision-api-text-detection-display-words-by-block

export const parseImage = onObjectFinalized(async (event) => {
  const fileBucket = event.data.bucket; // Storage bucket containing the file.
  const filePath = event.data.name; // File path in the bucket.

  // Parse the image text using tesseract
  //const imageBucket = `gs://${fileBucket}/${filePath}`; //"gs://dtaraang-chek.firebasestorage.app";
  //const imagePath = imageBucket + "/" + name //"/pixxie/pixxie_march_2025_schedule-1.webp"
  const imagePath = `gs://${fileBucket}/${filePath}`;
  logger.log("imagePath: " + imagePath)
  const client = new vision.ImageAnnotatorClient();
  
  //const [result] = await client.textDetection(imagePath);
  //const [result] = await client.documentTextDetection(imagePath);
  const [result] = await client.documentTextDetection(imagePath);
  const detections = result.textAnnotations;
  
  if (detections && detections.length > 0) {
    // The first element contains the full text.
    logger.log(detections[0].description);
  } else {
    logger.log("no text");
  }

  logger.log(result.fullTextAnnotation)
  const document = result.fullTextAnnotation
  if (document?.pages){
    for (const page of document?.pages) {
      //logger.log(page)
      for (const block in page.blocks){
        logger.log(block)
        break
      }
      break
    }
  }
});