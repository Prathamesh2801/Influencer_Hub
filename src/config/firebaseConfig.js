// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC9AopJqvy6xh8tTzjprSHldUKZkpKwXvw",
  authDomain: "influencerhub-24ac7.firebaseapp.com",
  projectId: "influencerhub-24ac7",
  storageBucket: "influencerhub-24ac7.firebasestorage.app",
  messagingSenderId: "1074407246164",
  appId: "1:1074407246164:web:f1df82a0abb681a5caa0c1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export { messaging, getToken, onMessage };