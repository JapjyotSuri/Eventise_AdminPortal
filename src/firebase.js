// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getFirestore} from "@firebase/firestore"
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAJPl0byNjAdM8fY6BasCT87AXRjWLatAQ",
  authDomain: "event-manager-8d38b.firebaseapp.com",
  projectId: "event-manager-8d38b",
  storageBucket: "event-manager-8d38b.appspot.com",
  messagingSenderId: "21431401143",
  appId: "1:21431401143:web:72660ec1e1db307ecdeb32"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestore=getFirestore(app);