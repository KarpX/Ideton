// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA2AcaY9RiDSylMYoTAXpnWN2wdTSsrIgs",
  authDomain: "ideton-dc85f.firebaseapp.com",
  projectId: "ideton-dc85f",
  storageBucket: "ideton-dc85f.firebasestorage.app",
  messagingSenderId: "798823977743",
  appId: "1:798823977743:web:c8a3732fb977c2792fa47a",
  measurementId: "G-V4DXSWB8D3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);
