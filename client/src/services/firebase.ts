import firebase from "firebase/app";
//limit import to auth (keep comment to keep linter happy)
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyApDXStJREUsZymQBGs4yJXi22wc3PBvSo",
  authDomain: "bp-pregnancy-centre.firebaseapp.com",
  projectId: "bp-pregnancy-centre",
  storageBucket: "bp-pregnancy-centre.appspot.com",
  messagingSenderId: "907701825043",
  appId: "1:907701825043:web:e967c13a3543cbd8a219e6",
};
try {
  firebase.initializeApp(firebaseConfig);
} catch (err) {
  if (!/already exists/.test(err.message)) {
    console.error("Firebase initialization error", err.stack);
  }
}
export default firebase;
