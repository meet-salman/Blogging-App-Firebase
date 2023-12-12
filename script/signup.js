import { auth, db, storage, collection, addDoc } from "./config.js";
import { onAuthStateChanged, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js";


const userProfile = document.querySelector('#user-profile');
const signupForm = document.querySelector('#signup-form');
const firstName = document.querySelector('#first-name');
const lastName = document.querySelector('#last-name');
const email = document.querySelector('#email');
const password = document.querySelector('#password');
const confirmPassword = document.querySelector('#confirm-password');
let profilePic = document.querySelector('#profile-pic');
let modal = document.querySelector('#modal');


userProfile.innerHTML = `

        <div class="dropdown dropdown-end">
            <label tabindex="0" class="btn btn-ghost btn-circle avatar">
                <div class="w-8 rounded-full">
                    <img src="./assets/user-icon.png" alt="profile-pic">
                </div>
            </label>
            <ul tabindex="0" class="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                <li><button> <a href="./login.html"> Login </a> </button></li>
                <li><button> <a href="./signup.html"> Register </a> </button></li>
            </ul>
        </div>
        `


// SignUp User
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    modal.showModal();

    // User Register
    createUserWithEmailAndPassword(auth, email.value, password.value)
        .then((userCredential) => {
            const user = userCredential.user;

            // Uploading Profile Picture
            profilePic = profilePic.files[0]
            const storageRef = ref(storage, email.value);

            uploadBytes(storageRef, profilePic).then(() => {

                // GEtting Profile Picture URL
                getDownloadURL(storageRef).then((url) => {

                    // Add User to DB
                    const userData = {
                        name: firstName.value + ' ' + lastName.value,
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

