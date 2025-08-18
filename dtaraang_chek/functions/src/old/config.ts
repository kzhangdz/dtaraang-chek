import dotenv from "dotenv";
//import { initializeApp } from "firebase/app";
//import { initializeApp } from "firebase-admin/app";
//import { getFirestore } from 'firebase-admin/firestore';
import * as admin from 'firebase-admin';
import { getStorage } from 'firebase-admin/storage';


// grab env variables from .env.local
dotenv.config()

//const API_KEY = "AIzaSyDcH1oLXeKyah6ER4D8shWRO93lgbO0Cbc";

var serviceAccount = require("../keys/dtaraang-chek-firebase-adminsdk.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "dtaraang-chek.firebasestorage.app"
});
export const db = admin.firestore();
export const bucket = getStorage().bucket();

// const firebaseConfig = {
//   apiKey: API_KEY, //process.env.GOOGLE_API_KEY,
//   authDomain: "dtaraang-chek.firebaseapp.com",
//   projectId: "dtaraang-chek",
//   storageBucket: "dtaraang-chek.firebasestorage.app",
//   messagingSenderId: "1086978762239",
//   appId: "1:1086978762239:web:ba7d2df8799b2f8d9b33ca",
//   measurementId: "G-RLJP095WXD"
// };

// admin.initializeApp(firebaseConfig);
// export const db = admin.firestore();

// const app = initializeApp(firebaseConfig);
// export const db = getFirestore(app);

// const app = initializeApp(firebaseConfig);
// export const db = getFirestore(app);

if (require.main === module) {
  console.log(process.env);
}