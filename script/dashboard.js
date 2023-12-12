import { auth, db, collection, addDoc, orderBy } from "./config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

const userProfile = document.querySelector('#user-profile');
const blogForm = document.querySelector('#blog-form');
const myBlogs = document.querySelector('#my-blogs');
const title = document.querySelector('#title');
const content = document.querySelector('#content');


// Date & Time
const date = new Date();

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const time = date.getTime();
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

            // console.log(doc.data());
            userData = doc.data();
            // userName.innerHTML = doc.data().name;
            gettingBlogs();
        });

        userProfile.innerHTML = `

        <div class="dropdown dropdown-end">
            <div class="flex items-center">
                <label tabindex="0" class="btn btn-ghost btn-circle avatar">
                   <div class="w-8 rounded-full border border-white">
                       <img src="${userData.profilePic}" alt="profile-pic">
                    </div>
                </label>
               <p class="text-lg text-white font-medium"> ${userData.name} </p>
            </div>
            
            <ul tabindex="0" class="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                 <li><button> <a href="./profile.html"> Profile </a> </button></li>
                 <li><button> <a href="./dashboard.html"> Dashboard </a> </button></li>
                 <li><button id="logout-btn"> Log Out </button></li>
            </ul>
        </div>
        `

        // User logout Function
        const logoutBtn = document.querySelector('#logout-btn');

        logoutBtn.addEventListener('click', () => {

            signOut(auth).then(() => {
                // Sign-out successful.
                window.location = 'home.html'
            }).catch((error) => {
                // An error happened.
            });
        });

    } else {
        window.location = 'home.html'
    }
});


// Blog Posting
blogForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Add User to DB
    const blogPost = {
        title: title.value,
        content: content.value,
        time: time,
        date: formattedDate,
        userData
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

    const q = query(collection(db, "Blog Posts"), where("userData.uid", "==", userData.uid), orderBy('time', 'desc'), orderBy('date', 'desc'));
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
                            <img class="blog-profile-pic rounded-md" src="${blog.userData.profilePic}" alt="profile-pic">
                        </div>
                        <div class="pl-4">
                            <h2 class="leading-6 text-lg font-semibold"> ${blog.title} </h2>
                            <p class="mt-1 text-sm font-medium text-[#3f3f3f]"> ${blog.userData.name} - ${blog.date} </p>
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