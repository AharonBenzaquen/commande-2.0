
// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyALUrQuu-YPwphPsSfeeIR6nUWeM_0MLOU",
  authDomain: "optiw-commande.firebaseapp.com",
  projectId: "optiw-commande",
  storageBucket: "optiw-commande.firebasestorage.app",
  messagingSenderId: "158440922354",
  appId: "1:158440922354:web:476059771ab0626f7dc46b",
  measurementId: "G-CMN4KVDVES"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
