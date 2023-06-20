import { getApps, initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyDD2esti2g77jPL3wxrGgOV2HrI5ro0XGQ",
    authDomain: "hotel-management-2449f.firebaseapp.com",
    projectId: "hotel-management-2449f",
    storageBucket: "hotel-management-2449f.appspot.com",
    messagingSenderId: "709637214971",
    appId: "1:709637214971:web:608d8dc4cfe1dc726c965e",
    measurementId: "G-CCYDJWMQSM"
};

// Initialize Firebase

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export { firebaseConfig, app }