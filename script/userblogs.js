import { auth, db, collection, getDocs, query, where, orderBy } from "./config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

const data = localStorage.getItem('specificUser');
const specificUser = JSON.parse(data);

const userProfile = document.querySelector('#user-profile');
const userProfileData = document.querySelector('#user-profile-data');
const userBlogsFrom = document.querySelector('#user-blogs-from');
const userBlogs = document.querySelector('#user-blogs');


let userData = {};
// Checking User Login or Logout
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const uid = user.uid;

        const q = query(collection(db, "users"), where("uid", "==", specificUser));

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {

            console.log(doc.data());
            userData = doc.data();
            gettingBlogs()
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
                window.location = 'home.html'
            }).catch((error) => {
                // An error happened.
            });
        });

    } else {
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
        gettingBlogs();
    }
});



// Getting Blogs from DB
let allBlogs = [];
async function gettingBlogs() {
    allBlogs = [];

    const q = query(collection(db, "Blog Posts"), where("userData.uid", "==", specificUser), orderBy('time', 'desc'), orderBy('date', 'desc'));;
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {

        // console.log(doc.data());
        allBlogs.push(doc.data());
    });
    // console.log(allBlogs);
    renderingBlogs();

    userProfileData.innerHTML = `
    
    <a href="#" class="underline"> ${allBlogs[0].userData.email} </a>
    <h2 class="text-2xl font-semibold"> ${allBlogs[0].userData.name} </h2>

    <div class="mt-3">
        <img class="rounded-lg w-[250px] h-[250px]"
            src="${allBlogs[0].userData.profilePic}" alt="profile-pic">
    </div>
    
    `
};


// Rendering Blogs
function renderingBlogs() {
    userBlogs.innerHTML = '';

    allBlogs.forEach(blog => {

        userBlogs.innerHTML += `
        
                <div class="w-[80%] my-6 p-5 rounded-lg shadow-gray-200 shadow-lg bg-white">
    
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
    
                </div>
        `
    });
};