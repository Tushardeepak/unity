import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyBFAJjA2yrVJ2wjUzcFPkmdGOpwhjr_0XU",
  authDomain: "kiitunite-80e27.firebaseapp.com",
  databaseURL: "https://kiitunite-80e27.firebaseio.com",
  projectId: "kiitunite-80e27",
  storageBucket: "kiitunite-80e27.appspot.com",
  messagingSenderId: "32764056812",
  appId: "1:32764056812:web:7db4ab58064e0cdce0c1c9",
  measurementId: "G-Q0HPVV7HGK",
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
