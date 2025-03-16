// Import the functions you need from the SDKs you need
import { FirebaseOptions, getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import envs from "./envs";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig: FirebaseOptions = {
  apiKey: envs.firebase.apiKey,
  authDomain: envs.firebase.authDomain,
  projectId: envs.firebase.projectId,
  storageBucket: envs.firebase.storageBucket,
  messagingSenderId: envs.firebase.messagingSenderId,
  appId: envs.firebase.appId,
  measurementId: envs.firebase.measurementId
};

console.log('hey')
console.log(firebaseConfig.apiKey)

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()

const auth = getAuth(app)

export { app, auth }