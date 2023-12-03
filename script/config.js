import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { getFirestore, collection, doc, addDoc } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js";


const firebaseConfig = {
    apiKey: "AIzaSyBu5Wx2Zedn5IMXEQWe2h_XTeXp9KAz5Kg",
    authDomain: "blogging-app-smit.firebaseapp.com",
    projectId: "blogging-app-smit",
    storageBucket: "blogging-app-smit.appspot.com",
    messagingSenderId: "1060607620891",
    appId: "1:1060607620891:web:c0a35d11c7d8760a5505be",
    measurementId: "G-W39555X0KC"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export { collection, doc, addDoc };