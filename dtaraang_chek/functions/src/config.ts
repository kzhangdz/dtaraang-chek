import dotenv from "dotenv";
import * as admin from 'firebase-admin';
import { getStorage } from 'firebase-admin/storage';


// grab env variables from .env.local
dotenv.config()

var serviceAccount = require("../keys/dtaraang-chek-firebase-adminsdk.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "dtaraang-chek.firebasestorage.app"
});
export const db = admin.firestore();
export const bucket = getStorage().bucket();

if (require.main === module) {
  console.log(process.env);
}