import dotenv from "dotenv";
import { initializeApp } from 'firebase/app';
import { getFirestore, GeoPoint } from 'firebase/firestore';
import { collection, query, where, getDocs } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { ApifyClient } from 'apify-client';
import fetch from 'node-fetch';

import * as fs from 'fs';
import path from 'path';

import { getAnalytics } from "firebase/analytics";

import { GoogleGenerativeAI} from "@google/generative-ai";

// const firebaseConfig = {
//     storageBucket: "gs://dtaraang-chek.firebasestorage.app",
// };

// grab env variables from .env.local
dotenv.config()

// remove firebase config

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function callApify(){

  // TODO: move token to env file
  const apifyClient = new ApifyClient({ token: process.env.APIFY_API_KEY || "" });

  // Define the input for the Actor
  const actorInput = {
      directUrls: [ 
          "https://www.instagram.com/pixxie_official/"
      ],
      resultsType: "posts",
      resultsLimit: 5,
      onlyPostsNewerThan: "3 days"
  };

  // Run an Actor with an input and wait for it to finish
  console.log("Running the Actor...");
  const actorRun = await apifyClient
      .actor("apify/instagram-scraper")
      .call(actorInput);
  console.log("🚀 Actor finished:", actorRun);

  // Load the data from the dataset
  const { items } = await apifyClient
      .dataset(actorRun.defaultDatasetId)
      .listItems();

  // Integrate the data into your application
  console.log("Data from the dataset:", items);
  console.log(`💾 Check your data here: https://console.apify.com/storage/datasets/${actorRun.defaultDatasetId}`);

}

// run if needed for testing
//callApify();

const sampleData = [
  {
    inputUrl: 'https://www.instagram.com/pixxie_official/',
    id: '3687361308854381515',
    type: 'Sidecar',
    shortCode: 'DMsI5LsyOvL',
    caption: '📢 อัปเดตตารางงาน PiXXiE เดือนสิงหาคม 2568 💜\n' +
      '\n' +
      'ฝากติดตามสาว ๆ ด้วยนะคะ หากมีตารางงานเพิ่มเติม ทีมงานจะแจ้งให้ทราบอีกครั้งค่ะ 🧚🏻‍♀️✨\n' +
      '\n' +
      '#PiXXiE\n' +
      '#litentertainmentth',
    hashtags: [ 'PiXXiE', 'litentertainmentth' ],
    mentions: [],
    url: 'https://www.instagram.com/p/DMsI5LsyOvL/',
    commentsCount: 0,
    firstComment: '',
    latestComments: [],
    dimensionsHeight: 1080,
    dimensionsWidth: 1080,
    displayUrl: 'https://instagram.fagc1-1.fna.fbcdn.net/v/t39.30808-6/525142745_1325369036261789_4011688181863516371_n.jpg?stp=dst-jpg_e35_s1080x1080_sh0.08_tt6&_nc_ht=instagram.fagc1-1.fna.fbcdn.net&_nc_cat=105&_nc_oc=Q6cZ2QFyAMftshlwuW4v7LH2ybhHr97rJteL35fBO3ZLP_sZIKlI-ZgLhCTpon6mdB7qHvc&_nc_ohc=mfUGDB6oRawQ7kNvwHWKTsA&_nc_gid=YsMGs_YqLTX90LNPjmXNJQ&edm=APs17CUAAAAA&ccb=7-5&oh=00_AfXQUrjVxDLVChHx6dZO89dZ55pQbyUJPO3-xAWsc-73UA&oe=68A1D5B6&_nc_sid=10d13b',
    images: [
      'https://instagram.fagc1-1.fna.fbcdn.net/v/t39.30808-6/525142745_1325369036261789_4011688181863516371_n.jpg?stp=dst-jpg_e35_s1080x1080_sh0.08_tt6&_nc_ht=instagram.fagc1-1.fna.fbcdn.net&_nc_cat=105&_nc_oc=Q6cZ2QFyAMftshlwuW4v7LH2ybhHr97rJteL35fBO3ZLP_sZIKlI-ZgLhCTpon6mdB7qHvc&_nc_ohc=mfUGDB6oRawQ7kNvwHWKTsA&_nc_gid=YsMGs_YqLTX90LNPjmXNJQ&edm=APs17CUAAAAA&ccb=7-5&oh=00_AfXQUrjVxDLVChHx6dZO89dZ55pQbyUJPO3-xAWsc-73UA&oe=68A1D5B6&_nc_sid=10d13b',
      'https://instagram.fagc1-2.fna.fbcdn.net/v/t39.30808-6/524487268_1325369032928456_7414244652758186393_n.jpg?stp=dst-jpg_e35_s1080x1080_sh0.08_tt6&_nc_ht=instagram.fagc1-2.fna.fbcdn.net&_nc_cat=108&_nc_oc=Q6cZ2QFyAMftshlwuW4v7LH2ybhHr97rJteL35fBO3ZLP_sZIKlI-ZgLhCTpon6mdB7qHvc&_nc_ohc=aKpDkxrdG3UQ7kNvwGkCirt&_nc_gid=YsMGs_YqLTX90LNPjmXNJQ&edm=APs17CUAAAAA&ccb=7-5&oh=00_AfUokEDUAAhsMoDN2E100Oglj094GJbQF-z7Lvk6af3Udw&oe=68A20A76&_nc_sid=10d13b'
    ],
    alt: 'Photo by PiXXiE on July 29, 2025. May be a graphic of 3 people, poster, magazine and text.',
    likesCount: 4244,
    timestamp: '2025-07-29T11:15:43.000Z',
    childPosts: [ [Object], [Object] ],
    ownerFullName: 'PiXXiE',
    ownerUsername: 'pixxie_official',
    ownerId: '44294240959',
    isSponsored: false,
    isPinned: true,
    isCommentsDisabled: false
  },
  {
    inputUrl: 'https://www.instagram.com/pixxie_official/',
    id: '3696775766840372904',
    type: 'Video',
    shortCode: 'DNNlfk8yu6o',
    caption: 'เบื้องหลังยังน่ารักขนาดนี้ ตัวจริงจะน่ารักขนาดไหน!!\n' +
      '\r\n' +
      'พวกเรา PiXXiE รอเจอทุกคน พร้อมเตรียมเมนูสุดพิเศษ ไม่เหมือนงานไหนๆแน่นอนค่ะ😆 มาค่ะ มาร่วมสนุกกับกิจกรรมของ Toppo                แล้วลุ้นมาเจอกับพวกเรา #PiXXiE ทั้ง 3 คนในอีเว้นท์สุดพิเศษ งานนี้เอ็กซ์คลูซีฟสุดๆ 😘\n' +
      '\r\n' +
      '📌 ดูรายละเอียดกิจกรรมเพิ่มเติมได้ที่ Facebook: Lotte Toppo Thailand เล้ยย!\r\n' +
      '\r\n' +
      '#Toppo #ToppoThailand #NoppoToppoChan\n' +
      '#DoubleFlavorDoubleFun #TOPPOxPiXXiE #TOPPOxPiXXiE_UNBOXความอร่อยสนุกไม่รู้จบ',
    hashtags: [
      'PiXXiE',
      'Toppo',
      'ToppoThailand',
      'NoppoToppoChan',
      'DoubleFlavorDoubleFun',
      'TOPPOxPiXXiE',
      'TOPPOxPiXXiE_UNBOXความอร่อยสนุกไม่รู้จบ'
    ],
    mentions: [],
    url: 'https://www.instagram.com/p/DNNlfk8yu6o/',
    commentsCount: 1,
    firstComment: 'sweet sweet',
    latestComments: [ [Object] ],
    dimensionsHeight: 360,
    dimensionsWidth: 640,
    displayUrl: 'https://scontent-gru2-2.cdninstagram.com/v/t51.2885-15/530066484_5171962873028162_7262095587767399643_n.jpg?stp=dst-jpg_e15_tt6&_nc_ht=scontent-gru2-2.cdninstagram.com&_nc_cat=102&_nc_oc=Q6cZ2QG_qqqFyZN_Ns9mk--WvJ-NdqZdLPi0_mK3DWrrW13E5yAdRmARMIZHtLgNHMr-jOA&_nc_ohc=7-dKNVe72V8Q7kNvwEBxzAg&_nc_gid=TBqbL-xiDXmvuOUuiWHYjg&edm=APs17CUBAAAA&ccb=7-5&oh=00_AfWnt7V41-iYeOiRpKbZ5oGQmCcsbDL_w7fTMwLTz1685A&oe=68A1E974&_nc_sid=10d13b',
    images: [],
    videoUrl: 'https://scontent-gru1-2.cdninstagram.com/o1/v/t16/f2/m86/AQOxBQMsHBC_ZFrBWjJXgqsrgZ_GXBaTXhg-S4R_MzZ6wfYLF0naRDJTCqf8SNXItL0ZF_wUTFBlnfisalTH4C2r1dHEHE-7wFpMyBM.mp4?stp=dst-mp4&efg=eyJxZV9ncm91cHMiOiJbXCJpZ193ZWJfZGVsaXZlcnlfdnRzX290ZlwiXSIsInZlbmNvZGVfdGFnIjoidnRzX3ZvZF91cmxnZW4uY2xpcHMuYzIuMTI3Ni5iYXNlbGluZSJ9&_nc_cat=110&vs=1501264504232120_3342744461&_nc_vs=HBksFQIYUmlnX3hwdl9yZWVsc19wZXJtYW5lbnRfc3JfcHJvZC9FRjQ5RkFCMkVEREE1N0EzNENBNTBDMTc4Njg2QzhBRl92aWRlb19kYXNoaW5pdC5tcDQVAALIARIAFQIYOnBhc3N0aHJvdWdoX2V2ZXJzdG9yZS9HT1BuckI5RjVfRzVWS3NDQUhXSGU0a003VGNzYnFfRUFBQUYVAgLIARIAKAAYABsAFQAAJu6LtaOrlpFAFQIoAkMzLBdAThmZmZmZmhgSZGFzaF9iYXNlbGluZV8xX3YxEQB1%2Fgdl5p0BAA%3D%3D&_nc_rid=9a45c1fa73&ccb=9-4&oh=00_AfVtDnaDiRWDPobxwRd6OnstZ1VD_U1OnXqVMxhmiA41Og&oe=689DF115&_nc_sid=10d13b',
    alt: null,
    likesCount: 1492,
    videoViewCount: 4584,
    videoPlayCount: 40562,
    timestamp: '2025-08-11T11:00:00.000Z',
    childPosts: [],
    ownerFullName: 'PiXXiE',
    ownerUsername: 'pixxie_official',
    ownerId: '44294240959',
    productType: 'clips',
    videoDuration: 60.21,
    isSponsored: false,
    taggedUsers: [ [Object], [Object], [Object] ],
    musicInfo: {
      artist_name: 'pixxie_official',
      song_name: 'Original audio',
      uses_original_audio: true,
      should_mute_audio: false,
      should_mute_audio_reason: '',
      audio_id: '2195416604266755'
    },
    isCommentsDisabled: false
  },
  {
    inputUrl: 'https://www.instagram.com/pixxie_official/',
    id: '3697530457723744357',
    type: 'Image',
    shortCode: 'DNQRFxmz7Bl',
    caption: 'BADLY I NONT TANONT Feat.PiXXiE\n' +
      '🪩😈\n'  +
      '\n' +
      '14 AUG 2025\n' +
      '🎧 Available on Streaming Platforms (00:00)\n' +
      '🎞️ Official Music Video (19:00) on LOVEiS YouTube\n'  +
      '\n' +
      '#BADLY\n' +
      '#NONTTANONT_FtPiXXiE\n' +
      '#NONTTANONT #PiXXiE\n' +
      '#LOVEiSENTERTAINMENT',
    hashtags: [
      'BADLY',
      'NONTTANONT_FtPiXXiE',
      'NONTTANONT',
      'PiXXiE',
      'LOVEiSENTERTAINMENT'
    ],
    mentions: [],
    url: 'https://www.instagram.com/p/DNQRFxmz7Bl/',
    commentsCount: 165,
    firstComment: 'คืออะไรค่ะ',
    latestComments: [
      [Object], [Object],
      [Object], [Object],
      [Object], [Object],
      [Object], [Object],
      [Object], [Object]
    ],
    dimensionsHeight: 1350,
    dimensionsWidth: 1080,
    displayUrl: 'https://scontent-gru1-2.cdninstagram.com/v/t51.2885-15/531216300_18521719312009760_3936309483810850865_n.jpg?stp=dst-jpg_e35_p1080x1080_sh0.08_tt6&_nc_ht=scontent-gru1-2.cdninstagram.com&_nc_cat=108&_nc_oc=Q6cZ2QFSk3UQS0cgmOYmLOmF4lXOJkxAKJBOuePduV7FcNNxy0T-XgrRPKyg4eC_0KnqLGA&_nc_ohc=6WEPstqDLZYQ7kNvwGAuerc&_nc_gid=lI3joqTC_rq0LFBAtRwFjw&edm=APs17CUBAAAA&ccb=7-5&oh=00_AfXDidsuajbRPDsIlEJZfE7GjgbP0OBg5Ln7196XCnfpQg&oe=68A20563&_nc_sid=10d13b',
    images: [],
    alt: 'Photo shared by LOVEiS on August 12, 2025 tagging @tanont916, @pimfestival, @mmabelzz, @inggkho_, @litentertainment.th, and @pixxie_official. Pode ser uma imagem de 2 pessoas, camisa, pôster, revista, figurino e texto que diz "BADIY YOUTUBELOVEIS YOL 14.AUG.2025 NO Τ FEAT.PİXXİE iXXiE".',
    likesCount: 38008,
    timestamp: '2025-08-12T12:00:00.000Z',
    childPosts: [],
    ownerFullName: 'LOVEiS',
    ownerUsername: 'loveis_ent',
    ownerId: '187273759',
    isSponsored: false,
    taggedUsers: [ [Object], [Object], [Object], [Object], [Object], [Object] ],
    coauthorProducers: [ [Object], [Object] ],
    isCommentsDisabled: false
  },
  {
    inputUrl: 'https://www.instagram.com/pixxie_official/',
    id: '3696846979822262592',
    type: 'Video',
    shortCode: 'DNN1r3NSBlA',
    caption: 'มาเสิร์ฟ #TOXIQUEchallenge ที่จะทำให้ทุกคนหูเคลือบทองแบบเกินต้านกันไปเลยค้าบ👂✨\n' +
      '\n' +
      '#PiXXiE #tinn\n' +
      '#PiXXiE_TOXIQUE\n' +
      '#TOXIQUE',
    hashtags: [
      'TOXIQUEchallenge',
      'PiXXiE',
      'tinn',
      'PiXXiE_TOXIQUE',
      'TOXIQUE'
    ],
    mentions: [],
    url: 'https://www.instagram.com/p/DNN1r3NSBlA/',
    commentsCount: 8,
    firstComment: '',
    latestComments: [
      [Object], [Object],
      [Object], [Object],
      [Object], [Object],
      [Object], [Object]
    ],
    dimensionsHeight: 1136,
    dimensionsWidth: 640,
    displayUrl: 'https://instagram.fcjb3-2.fna.fbcdn.net/v/t51.2885-15/530658032_2099397000591213_3954109166709023654_n.jpg?stp=dst-jpg_e15_tt6&_nc_ht=instagram.fcjb3-2.fna.fbcdn.net&_nc_cat=109&_nc_oc=Q6cZ2QH7vdyWYnRyO3x9ZdgjomOLzZibf47lVd2KkYKsukdSJl50V4kk8MxAVXRdmJmw_sc&_nc_ohc=YlzKx_pB6hoQ7kNvwE49mLf&_nc_gid=wOhOQuHFOfxLdYArQyxMRg&edm=APs17CUBAAAA&ccb=7-5&oh=00_AfWxy7KdYpOtgscB7OODEe1mnluXSSWk5WPhBZ7OiwgQkA&oe=68A200EE&_nc_sid=10d13b',
    images: [],
    videoUrl: 'https://instagram.fcjb3-2.fna.fbcdn.net/o1/v/t16/f2/m86/AQP96xohd9hTlN4H9NiLPu5LP8MOm1uH5ltr6UN8FNBGD8GBYEkChRAn-XDxlTD3vr2HvslZizWvlG_FN4S1aIXcowwyKmRGgKLAkMQ.mp4?stp=dst-mp4&efg=eyJxZV9ncm91cHMiOiJbXCJpZ193ZWJfZGVsaXZlcnlfdnRzX290ZlwiXSIsInZlbmNvZGVfdGFnIjoidnRzX3ZvZF91cmxnZW4uY2xpcHMuYzIuNzIwLmJhc2VsaW5lIn0&_nc_cat=109&vs=24146720511636362_2301559203&_nc_vs=HBksFQIYUmlnX3hwdl9yZWVsc19wZXJtYW5lbnRfc3JfcHJvZC9ENDRBMjU1MzIwMDcxOTlDQjYzQ0E5OTI5NzNFOEFCOV92aWRlb19kYXNoaW5pdC5tcDQVAALIARIAFQIYOnBhc3N0aHJvdWdoX2V2ZXJzdG9yZS9HQUxiakI4VlBkNTBETFlDQVBreWpCdExRTk5wYnFfRUFBQUYVAgLIARIAKAAYABsAFQAAJpS2rJCTyLo%2FFQIoAkMzLBdAOW7ZFocrAhgSZGFzaF9iYXNlbGluZV8xX3YxEQB1%2Fgdl5p0BAA%3D%3D&_nc_rid=cae9d3a0b8&ccb=9-4&oh=00_AfUFoyNCVnro8uVxf2Cv3o2BX46TfOmmtS3dqxeQiWuBpw&oe=689DE734&_nc_sid=10d13b',
    alt: null,
    likesCount: 7292,
    videoViewCount: 20689,
    videoPlayCount: 108442,
    timestamp: '2025-08-11T13:22:59.000Z',
    childPosts: [],
    ownerFullName: 'PiXXiE',
    ownerUsername: 'pixxie_official',
    ownerId: '44294240959',
    productType: 'clips',
    videoDuration: 25.433,
    isSponsored: false,
    taggedUsers: [ [Object], [Object], [Object], [Object] ],
    musicInfo: {
      artist_name: 'Pixxie',
      song_name: 'TOXIQUE',
      uses_original_audio: false,
      should_mute_audio: false,
      should_mute_audio_reason: '',
      audio_id: '674517518324161'
    },
    isCommentsDisabled: false
  },
  {
    inputUrl: 'https://www.instagram.com/pixxie_official/',
    id: '3617563722329415923',
    type: 'Video',
    shortCode: 'DI0KwntyODz',
    caption: '𝑻𝑼𝑹𝑵 𝑻𝑶 ‘𝑻𝑶𝑿𝑰𝑸𝑼𝑬’ 𝑴𝑶𝑫𝑬 🔥🚨\n'                  +
      '\n' +
      '📌 OFFICIAL M/V OUT NOW!! ON YOUTUBE : LIT Entertainment \n' +
      '🎧 LISTEN ON ALL MUSIC STREAMING\n' +
      '\n' +
      '#PiXXiE\n' +
      '#TOXIQUE\n' +
      '#PiXXiE_TOXIQUE\n' +
      '#litentertainmentth',
    hashtags: [ 'PiXXiE', 'TOXIQUE', 'PiXXiE_TOXIQUE', 'litentertainmentth' ],
    mentions: [],
    url: 'https://www.instagram.com/p/DI0KwntyODz/',
    commentsCount: 42,
    firstComment: '',
    latestComments: [
      [Object], [Object],
      [Object], [Object],
      [Object], [Object],
      [Object], [Object],
      [Object], [Object]
    ],
    dimensionsHeight: 1333,
    dimensionsWidth: 750,
    displayUrl: 'https://scontent-yyz1-1.cdninstagram.com/v/t51.2885-15/491515129_18060783005472960_6619233385277075068_n.jpg?stp=dst-jpg_e15_tt6&_nc_ht=scontent-yyz1-1.cdninstagram.com&_nc_cat=100&_nc_oc=Q6cZ2QHIRlRzc9f7H4gSHSpVVnRliOeilRggHhXtlMHZvpPkd3lbznRgF-YThc7vJL6U_UY&_nc_ohc=13ShYUgfmsYQ7kNvwEJ8LJJ&_nc_gid=48-xjfMqX8tD0gtw_XCqCw&edm=APs17CUBAAAA&ccb=7-5&oh=00_AfWozcrk5blhSl_NMRYg4z4rSPUmEiR9Sg_ReSvkxeYdAQ&oe=68A1F7F8&_nc_sid=10d13b',
    images: [],
    videoUrl: 'https://scontent-yyz1-1.cdninstagram.com/o1/v/t16/f2/m86/AQPWjB0s0qzujbJ_mpLbEpr8Pb4beF81_RYWx2d08votKc-zDYe4SMmLKQ1gyNJPsLGps_YfzEoqmYHNcqG9nDkyiuCnENt1c0WptyY.mp4?stp=dst-mp4&efg=eyJxZV9ncm91cHMiOiJbXCJpZ193ZWJfZGVsaXZlcnlfdnRzX290ZlwiXSIsInZlbmNvZGVfdGFnIjoidnRzX3ZvZF91cmxnZW4uY2xpcHMuYzIuNzIwLmJhc2VsaW5lIn0&_nc_cat=104&vs=1175234520537762_2183980986&_nc_vs=HBksFQIYUmlnX3hwdl9yZWVsc19wZXJtYW5lbnRfc3JfcHJvZC8wNDQyNDI1QTZGMTdBNzNFRTdGQTJFOUNDN0FDNEZBOV92aWRlb19kYXNoaW5pdC5tcDQVAALIARIAFQIYOnBhc3N0aHJvdWdoX2V2ZXJzdG9yZS9HS2VBU0IwS3JzbW5ycElIQU9taFJUNFEyWjhsYnFfRUFBQUYVAgLIARIAKAAYABsAFQAAJrD9n7r23JZAFQIoAkMzLBdAQAzMzMzMzRgSZGFzaF9iYXNlbGluZV8xX3YxEQB1%2Fgdl5p0BAA%3D%3D&_nc_rid=4b7947c20f&ccb=9-4&oh=00_AfUZwxYJQFimTqEQI1D85LB3bU6xFfGfrXzI4Y_zUXP_Ng&oe=689E1277&_nc_sid=10d13b',
    alt: null,
    likesCount: 22191,
    videoViewCount: 57162,
    videoPlayCount: 326559,
    timestamp: '2025-04-24T04:00:00.000Z',
    childPosts: [],
    ownerFullName: 'PiXXiE',
    ownerUsername: 'pixxie_official',
    ownerId: '44294240959',
    productType: 'clips',
    videoDuration: 32.1,
    isSponsored: false,
    taggedUsers: [ [Object], [Object], [Object] ],
    isPinned: true,
    musicInfo: {
      artist_name: 'Pixxie',
      song_name: 'TOXIQUE',
      uses_original_audio: false,
      should_mute_audio: false,
      should_mute_audio_reason: '',
      audio_id: '674517518324161'
    },
    isCommentsDisabled: false
  }
];

async function parseData(jsonArray: Object[]){
    const storage = getStorage(app);

    // get the schedules
    const scheduleArray = jsonArray.filter(j => j.caption.includes("ตาราง"))
    for (const postJson of scheduleArray){
        console.log(postJson)
    
        // grab the images. needs to check `images` array first and then `displayUrl`
        

        //check if an `image` exists w/ that Instagram link. Probably needs to be the photo link. Take off anything after ? when saving into the db.
        const imagesCollection = "images" // TODO: put in constant file
        const instagramPostUrl = postJson.url
        const q = query(collection(db, imagesCollection), where("instagram_post_url", "==", instagramPostUrl));

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.log("No matching 'images' documents with that instagram_post_url.");

            /* 
            * start process to save the info
            */  

            // select the images, as an array
            const images = postJson.images.length == 0 ? [postJson.displayUrl] : postJson.images
            

            for (let i = 0; i < images.length; i++){
                // download the images to temp storage
                //const fileRef = ref(storage, "pixxie/pixxie_march_2025_schedule-1.webp");
                //console.log(fileRef)

                const currentImageUrl = images[i]
                
                // fetch file from the url
                console.log(currentImageUrl);
                const response = await fetch(currentImageUrl);
                if (!response.ok) {
                    console.log(`Failed to fetch file: ${response.statusText}`);
                    break // end fetching for this post
                }

                const fileArrayBuffer = await response.arrayBuffer();
                const fileBuffer = Buffer.from(fileArrayBuffer)

                const imageParts = [fileBufferToGenerativePart(fileBuffer)]
                //console.log(imageParts)

                //parse the image using Gemini
                const eventJsonArray = await parseImageForEvents(imageParts)

                if (eventJsonArray.length > 0){
                    // save the image to Storage
                    const folderName = postJson.ownerUsername
                    const fileName = currentImageUrl.substring(0, currentImageUrl.indexOf(".jpg"));
                    const storagePath = `artists/${folderName}/${fileName}}`
                    const storageRef = ref(storage, storagePath)
                    
                    await uploadBytes(storageRef, fileBuffer)

                    // get download url
                    const fileURL = await getDownloadURL(storageRef)

                    // for each event, save the event info into Firestore
                    for (const eventJson of eventJsonArray){
                        saveEvent(db, eventJson, postJson, fileURL)
                    }

                    // // save the image to Storage
                    // const fileName = `pixxie/${postJson.ownerUsername}/${postJson.shortCode}-${i}.webp`;
                    // const fileRef = ref(storage, fileName);
                    
                    // // upload the file
                    // await uploadBytes(fileRef, fileBuffer);

                    // // save the image info into `images` collection
                    // const imageDoc = {
                    //     owner_username: postJson.ownerUsername,
                    //     owner_full_name: postJson.ownerFullName,
                    //     instagram_post_url: postJson.url,
                    //     image_url: currentImageUrl,
                    //     file_name: fileName,
                    //     events: eventJson,
                    //     timestamp: new Date().toISOString(),
                    // };

                    // // add the document to Firestore
                    // await addDoc(collection(db, imagesCollection), imageDoc);
                }

                // temp
                break
            }
        } else {
            // Already parsed and saved this post. Skip to the next one
            continue

            querySnapshot.forEach((doc) => {
                // doc.data() is the document data
                console.log("Found document with ID:", doc.id);
            });
        }


    //parse the image using Gemini

    //check if the schedule data matches with the current artist

    //If imageNotExists and belongs to , save the picture into Storage and image info into `images`
    }
}

// TODO: add a dataConverter function to turn the eventJson into a Firestore document

async function saveEvent(db, eventJson, postJson, fileURL=null){
    const eventsCollection = "events" // TODO: put in constant file

    // create a sub-collection for the artist if not exists. Use the artist's instagram url as the collection name
    const artistSubCollection = postJson.ownerUsername;


    // check if the event already exists in the collection
    const q = query(collection(db, eventsCollection), where("event_name", "==", eventJson.event_name), where("start_date", "==", eventJson.start_date), where("end_date", "==", eventJson.end_date));

}

function fileBufferToGenerativePart(buffer, mimeType="image/jpeg"){
    return {
        inlineData: {
            data: buffer.toString("base64"),
            mimeType
        }
    }
}

// returns array of json events
async function parseImageForEvents(imageParts){
    const PARSE_IMAGE_PROMPT = `
        Extract the text from this image, returning an array. 
        Do not translate the text. 
        Each value is a json of this format: {artist_name, start_date, end_date, event_name, location, coordinates, time}. 
        If 'ร้าน' is in the event_name, it is also the location. 
        Retrieve lat/lon coordinates by geocoding the location in Thai. 
        Date should be in YYYY-MM-DD format. 
        Time should be in HH:MM format.
        `

    const API_KEY = process.env.GOOGLE_API_KEY;
    //console.log(process.env)
    //console.log(API_KEY)
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-pro"
    });

    const generationConfig = {
            responseMimeType: "application/json",
            responseSchema: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        artist_name: {
                            type: "string",
                        },
                        start_date: {
                            type: "string",
                        },
                        end_date: {
                            type: "string",
                        },
                        event_name: {
                            type: "string",
                        },
                        location: {
                            type: "string",
                        },
                        coordinates: {
                            type: "object",
                            properties: {
                                lat: {
                                    type: "number"
                                },
                                lon: {
                                    type: "number"
                                },
                            },
                        },
                        time: {
                            type: "string",
                        }
                    },
                },
            },
        }

    //upload picture based on ownerUsername
    const result = await model.generateContent([PARSE_IMAGE_PROMPT, ...imageParts], generationConfig);
    const response = result.response;
    //console.log(response)
    console.log(response.text())

    const eventJson = extractJsonFromAIOutput(response.text())

    return eventJson;
}   

//parseData(sampleData)

const sampleResultText = `json
[
  {
    "artist_name": "PIXXIE",
    "start_date": "2025-08-02",
    "end_date": "2025-08-02",
    "event_name": "งาน Sabb fest 2025 (เวทีเด็กแด้น) (Festival)",
    "location": "ลานกิจกรรมเครื่องบิน Market (เมืองนครปฐม)",
    "coordinates": {
      "lat": 13.84051,
      "lon": 100.04364
    },
    "time": "17:00"
  },
  {
    "artist_name": "PIXXIE",
    "start_date": "2025-08-03",
    "end_date": "2025-08-03",
    "event_name": "งาน LOVEiS Campus Tour (Concert)",
    "location": "ลานหน้าอาคารกีฬาศาลายา, มหาวิทยาลัยธรรมศาสตร์ ศูนย์รังสิต",
    "coordinates": {
      "lat": 14.072236,
      "lon": 100.600125
    },
    "time": "21:00"
  },
  {
    "artist_name": "PIXXIE",
    "start_date": "2025-08-04",
    "end_date": "2025-08-05",
    "event_name": "ถ่าย *****",
    "location": null,
    "coordinates": null,
    "time": null
  },
  {
    "artist_name": "PIXXIE",
    "start_date": "2025-08-06",
    "end_date": "2025-08-06",
    "event_name": "ร้าน PROMPT จรัญฯ (ร้านกลางคืน)",
    "location": "ร้าน PROMPT จรัญฯ (ร้านกลางคืน)",
    "coordinates": {
      "lat": 13.784518,
      "lon": 100.485149
    },
    "time": "22:30"
  },
  {
    "artist_name": "PIXXIE",
    "start_date": "2025-08-07",
    "end_date": "2025-08-07",
    "event_name": "มาเบล ร่วมงาน Maison Kitsune FW25 Collection Press Preview",
    "location": "ร้าน Maison Kitsune สาขา Emquartier",
    "coordinates": {
      "lat": 13.73142,
      "lon": 100.56939
    },
    "time": "15:00"
  },
  {
    "artist_name": "PIXXIE",
    "start_date": "2025-08-08",
    "end_date": "2025-08-13",
    "event_name": "ถ่าย *****",
    "location": null,
    "coordinates": null,
    "time": null
  },
  {
    "artist_name": "PIXXIE",
    "start_date": "2025-08-14",
    "end_date": "2025-08-14",
    "event_name": "ถ่ายงาน CHAPS",
    "location": null,
    "coordinates": null,
    "time": null
  },
  {
    "artist_name": "PIXXIE",
    "start_date": "2025-08-15",
    "end_date": "2025-08-15",
    "event_name": "ถ่าย *****",
    "location": null,
    "coordinates": null,
    "time": null
  },
  {
    "artist_name": "PIXXIE",
    "start_date": "2025-08-16",
    "end_date": "2025-08-16",
    "event_name": "งาน 2025 Weibo Cultural Exchange Night in Thailand (Awards)",
    "location": "ศูนย์ประชุมแห่งชาติสิริกิติ์",
    "coordinates": {
      "lat": 13.725798,
      "lon": 100.559235
    },
    "time": "18:30"
  },
  {
    "artist_name": "PIXXIE",
    "start_date": "2025-08-17",
    "end_date": "2025-08-18",
    "event_name": "ถ่าย *****",
    "location": null,
    "coordinates": null,
    "time": null
  },
  {
    "artist_name": "PIXXIE",
    "start_date": "2025-08-19",
    "end_date": "2025-08-19",
    "event_name": "ร้าน Ratch Hour รัชโยธิน (ร้านกลางคืน)",
    "location": "ร้าน Ratch Hour รัชโยธิน (ร้านกลางคืน)",
    "coordinates": {
      "lat": 13.83021,
      "lon": 100.57009
    },
    "time": "23:00"
  },
  {
    "artist_name": "PIXXIE",
    "start_date": "2025-08-20",
    "end_date": "2025-08-21",
    "event_name": "ถ่าย *****",
    "location": null,
    "coordinates": null,
    "time": null
  },
  {
    "artist_name": "PIXXIE",
    "start_date": "2025-08-22",
    "end_date": "2025-08-22",
    "event_name": "ร่วมงาน JEEP 50th BIRTHDAY PARTY",
    "location": "งานปิด เฉพาะผู้ที่ได้รับเชิญ",
    "coordinates": null,
    "time": null
  }
]
`

function extractJsonFromAIOutput(aiData: string): Object[]{

    var startIndex = 0
    var endIndex = 0
    for(let i=0; i<aiData.length; i++){
        if (aiData[i] == "["){
            startIndex = i
            break
        }
    }
    for(let i=aiData.length-1; i>=0; i--){
        if (aiData[i] == "]"){
            endIndex = i
            break
        }
    }
    // no data
    if(startIndex == endIndex){
        return [];
    }

    const jsonText = aiData.substring(startIndex, endIndex + 1);
    //const jsonText = aiData.trim();

    try {
        const jsonData = JSON.parse(jsonText);
        return jsonData;
    } catch (error) {
        console.error("Error parsing json:", error);
        return [];
    }
}

//const data = extractJsonFromAIOutput(sampleResultText)
//console.log(data);




//node functions/src/test_apify_api.js