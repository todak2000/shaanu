// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
    getFirestore,
  } from "@firebase/firestore";
  import {
    getAuth,
  } from "firebase/auth";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCRNneXytU7VjKL1eF7bMlccCMBM9cX3AI",
  authDomain: "shaanu-3872b.firebaseapp.com",
  projectId: "shaanu-3872b",
  storageBucket: "shaanu-3872b.appspot.com",
  messagingSenderId: "247533864082",
  appId: "1:247533864082:web:4f5342d39c6f3db1a0124b",
  measurementId: "G-0STWGQ42T6"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize db
export const db = getFirestore(app);
export const auth = getAuth();