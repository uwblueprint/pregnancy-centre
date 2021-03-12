import firebase from "firebase/app";
//limit import to auth (keep comment to keep linter happy)
import "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: `${process.env.FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: `${process.env.FIREBASE_PROJECT_ID}.appspot.com`,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

try {
  firebase.initializeApp(firebaseConfig);
} catch (err) {
  //prevents console clutter on hot reload
  if (err.code === "app/duplicate-app") {
    console.error("Firebase initialization error", err.stack);
  }
}
export default firebase;
