import { auth, db, collection, addDoc } from "./config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";


const userName = document.querySelector('#user-name');
const logoutBtn = document.querySelector('#logout-btn');
const blogForm = document.querySelector('#blog-form');
const myBlogs = document.querySelector('#my-blogs');
const title = document.querySelector('#title');
const content = document.querySelector('#content');
let modal = document.querySelector('#modal');


// Date
const date = new Date();

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const monthName = months[date.getMonth()];
const day = date.getDate();
const year = date.getFullYear();
const formattedDate = `${monthName}, ${day} ${year}`;




let userData = {};
// Checking User Login or Logout
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const uid = user.uid;

        const q = query(collection(db, "users"), where("uid", "==", uid));

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {

            console.log(doc.data());
            userData = doc.data();
            userName.innerHTML = doc.data().name;
            gettingBlogs();
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


// Blog Posting
blogForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Add User to DB
    const blogPost = {
        title: title.value,
        content: content.value,
        uid: auth.currentUser.uid,
        date: formattedDate
    }
    addDoc(collection(db, "Blog Posts"), blogPost)
        .then((doc) => {
            console.log('Document Posted =>', doc.id);
            title.value = '';
            content.value = '';
            gettingBlogs();
        })
        .catch((rej) => {
            console.log(rej);
        });

});


// Getting Blogs from DB
let allBlogs = [];
async function gettingBlogs() {
    allBlogs = [];

    const q = query(collection(db, "Blog Posts"), where("uid", "==", userData.uid));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {

        // console.log(doc.data());
        allBlogs.push(doc.data());
        // console.log(allBlogs);
        renderingBlogs();
    });
};


// Rendering Blogs
function renderingBlogs() {

    myBlogs.innerHTML = '';

    allBlogs.forEach(blog => {

        myBlogs.innerHTML += `
    
             <div class="w-[70%] my-6 p-5 rounded-lg shadow-gray-200 shadow-lg bg-white">

                  <div class="flex">

                    <div>
                        <img class="blog-profile-pic rounded-md" src="${userData.profilePic}" alt="profile-pic">
                    </div>
                    <div class="pl-4">
                        <h2 class="leading-6 text-lg font-semibold"> ${blog.title} </h2>
                        <p class="mt-1 text-sm font-medium text-[#3f3f3f]"> ${userData.name} - ${blog.date} </p>
                    </div>

                   </div>

                   <div class="py-5">
                      <p class="text-[15px] text-[#757575]"> ${blog.content} </p>
                   </div>

                    <div>
                        <button> <a href="#" class="text-sm text-[#7749F8] mr-3"> Delete </a> </button>
                        <button> <a href="#" class="text-sm text-[#7749F8]"> Edit </a> </button>
                    </div>

                </div>
    `
    });



};