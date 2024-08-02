// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAlRiQH9Ol5Ctmuj_XlD8ZZI0HD06C_eDc",
  authDomain: "inventory-management-f978a.firebaseapp.com",
  projectId: "inventory-management-f978a",
  storageBucket: "inventory-management-f978a.appspot.com",
  messagingSenderId: "1089586767970",
  appId: "1:1089586767970:web:80248305dac0a0715f093b",
  measurementId: "G-BVECGBEDHN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)

export {firestore}