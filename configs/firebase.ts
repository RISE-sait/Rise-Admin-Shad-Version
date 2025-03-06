// Import the functions you need from the SDKs you need
import EnvConfigs from "@/config";
import { FirebaseOptions, getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig: FirebaseOptions = {
  apiKey: EnvConfigs.firebase.apiKey,
  authDomain: EnvConfigs.firebase.authDomain,
  projectId: EnvConfigs.firebase.projectId,
  storageBucket: EnvConfigs.firebase.storageBucket,
  messagingSenderId: EnvConfigs.firebase.messagingSenderId,
  appId: EnvConfigs.firebase.appId,
  measurementId: EnvConfigs.firebase.measurementId,
}
// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()

const auth = getAuth(app)

export { app, auth }