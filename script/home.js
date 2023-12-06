import { auth, db, collection, orderBy } from "./config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";


const loginBtn = document.querySelector('#login-btn');
const logoutBtn = document.querySelector('#logout-btn');
const goodTime = document.querySelector('#good-time');
const allBlogsSec = document.querySelector('#all-blogs-sec');


// Getting Time To Welcome Users
const rightNow = new Date();
let hours = rightNow.getHours();
const amPM = hours >= 12 ? 'PM' : 'AM';

// console.log(`${hours} : ${minutes} ${amPM}`);

if (amPM === 'AM' && hours >= 4 && hours < 12) {

    goodTime.innerHTML = 'Good Morning Readers'

} else if (amPM === 'PM' && hours >= 12 && hours < 16) {

    goodTime.innerHTML = 'Good After Noon Readers'

} else if (amPM === 'PM' && hours >= 16 && hours < 20) {

    goodTime.innerHTML = 'Good Evening Readers'

} else {
    goodTime.innerHTML = 'Good Night Readers'
}


let userData = {};
// Checking User Login or Logout
onAuthStateChanged(auth, async (user) => {
    if (user) {
        logoutBtn.className = "block bg-transparent border-none text-white font-medium"
        const uid = user.uid;

        const q = query(collection(db, "users"), where("uid", "==", uid));

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {

            console.log(doc.data());
            userData = doc.data();
            gettingBlogs()
        });

    } else {
        loginBtn.className = "block bg-transparent border-none text-white mr-8"
        gettingBlogs();
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


// Getting Blogs from DB
let allBlogs = [];
async function gettingBlogs() {
    allBlogs = [];

    const q = query(collection(db, "Blog Posts"), orderBy('date', 'desc'));

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
    allBlogsSec.innerHTML = '';

    allBlogs.forEach(blog => {

        allBlogsSec.innerHTML += `
        
                 <div class="w-[70%] my-6 p-5 rounded-lg shadow-gray-200 shadow-lg bg-white">
    
                      <div class="flex">
    
                        <div>
                            <img class="blog-profile-pic rounded-md" src="${blog.profile}" alt="profile-pic">
                        </div>
                        <div class="pl-4">
                            <h2 class="leading-6 text-lg font-semibold"> ${blog.title} </h2>
                            <p class="mt-1 text-sm font-medium text-[#3f3f3f]"> ${blog.name} - ${blog.date} </p>
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