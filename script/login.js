// import { onAuthStateChanged } from "./signup.js";
import { auth } from "./config.js";
import { onAuthStateChanged, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";


const loginForm = document.querySelector('#login-form');
const email = document.querySelector('#email');
const password = document.querySelector('#password');
const error = document.querySelector('#error');
let modal = document.querySelector('#modal');


// Changing Page Location If User Login 
onAuthStateChanged(auth, (user) => {
    if (user) {
        window.location = 'dashboard.html'
    }
});


// User Login 
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    modal.showModal()

    signInWithEmailAndPassword(auth, email.value, password.value)
        .then((userCredential) => {
            const user = userCredential.user;
            error.innerHTML = '';
            window.location = 'dashboard.html'
        })
        .catch((err) => {
            const errorCode = err.code;
            const errorMessage = err.message;
            error.innerHTML = 'Invalid Login Credentials.';
        });
});


