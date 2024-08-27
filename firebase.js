// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAaKZKxx8ZrvAOY4e57v80qWwR0V2cFgXs",
  authDomain: "ai-flashcards-3aa17.firebaseapp.com",
  projectId: "ai-flashcards-3aa17",
  storageBucket: "ai-flashcards-3aa17.appspot.com",
  messagingSenderId: "736639748081",
  appId: "1:736639748081:web:f3cc21428f6fbe3dfde650"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
