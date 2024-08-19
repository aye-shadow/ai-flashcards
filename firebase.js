// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCxF4edn6pHofXGveZPSCI9kJJQY1IXIbY",
  authDomain: "flashcard-19f32.firebaseapp.com",
  projectId: "flashcard-19f32",
  storageBucket: "flashcard-19f32.appspot.com",
  messagingSenderId: "1073542769874",
  appId: "1:1073542769874:web:d344dd55eb13b1da80910b",
  measurementId: "G-B2415YPWMS",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db };
