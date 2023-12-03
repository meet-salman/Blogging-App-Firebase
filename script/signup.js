import { auth, db, storage, collection, addDoc } from "./config.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js";



const signupForm = document.querySelector('#signup-form');
const firstName = document.querySelector('#first-name');
const lastName = document.querySelector('#last-name');
const email = document.querySelector('#email');
const password = document.querySelector('#password');
const confirmPassword = document.querySelector('#confirm-password');
let profilePic = document.querySelector('#profile-pic');
let modal = document.querySelector('#modal');



// SignUp User
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    modal.showModal();

    // User Register
    createUserWithEmailAndPassword(auth, email.value, password.value)
        .then((userCredential) => {
            const user = userCredential.user;

            const fullName = firstName.value + ' ' + lastName.value;

            // Uploading Profile Picture
            profilePic = profilePic.files[0]
            const storageRef = ref(storage, fullName);

            uploadBytes(storageRef, profilePic).then(() => {

                // GEtting Profile Picture URL
                getDownloadURL(storageRef).then((url) => {

                    // Add User to DB
                    const userData = {
                        name: fullName,
                        email: email.value,
                        uid: user.uid,
                        profilePic: url
                    }
                    addDoc(collection(db, "users"), userData)
                        .then(() => {
                            console.log('User Added to BD');
                            window.location = 'dashboard.html';
                        })
                        .catch((rej) => {
                            console.log(rej);
                        });
                });
            });
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorMessage);
        });
});

