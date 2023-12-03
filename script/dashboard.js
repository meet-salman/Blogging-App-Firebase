import { auth, db, collection, addDoc } from "./config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";


const userName = document.querySelector('#user-name');
const logoutBtn = document.querySelector('#logout-btn');
const blogForm = document.querySelector('#blog-form');
const title = document.querySelector('#title');
const content = document.querySelector('#content');
let modal = document.querySelector('#modal');



// Checking User Login or Logout
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const uid = user.uid;

        const q = query(collection(db, "users"), where("uid", "==", uid));

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {

            console.log(doc.data());
            userName.innerHTML = doc.data().name;
        });

    } else {
        window.location = 'home.html'
    }
});


// User logout Function
logoutBtn.addEventListener('click', () => {

    signOut(auth).then(() => {
        // Sign-out successful.
        window.location = 'home.html'
    }).catch((error) => {
        // An error happened.
    });
});


blogForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Add User to DB
    const blogPost = {
        title: title.value,
        content: content.value,
        uid: auth.currentUser.uid
    }
    addDoc(collection(db, "Blog Posts"), blogPost)
        .then((doc) => {
            console.log('Document Posted =>', doc.id);
        })
        .catch((rej) => {
            console.log(rej);
        });

});
