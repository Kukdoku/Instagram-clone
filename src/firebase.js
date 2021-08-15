import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyADonDW6sb4eCGadvUQ6LqUvEV-jm_ZCKE",
  authDomain: "photo-gallary-20dd4.firebaseapp.com",
  projectId: "photo-gallary-20dd4",
  storageBucket: "photo-gallary-20dd4.appspot.com",
  messagingSenderId: "178984264001",
  appId: "1:178984264001:web:17245777cdf4dd689d41c0",
  measurementId: "G-ZXY39RJ1T9",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
