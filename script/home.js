import { auth, db, collection, getDocs, query, where, orderBy } from "./config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";


const userProfile = document.querySelector('#user-profile');
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
        const uid = user.uid;

        const q = query(collection(db, "users"), where("uid", "==", uid));

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

    const q = query(collection(db, "Blog Posts"), orderBy('time', 'desc'), orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {

        // console.log(doc.data());
        allBlogs.push(doc.data());
        // console.log(allBlogs);
    });
    renderingBlogs();
};


// Rendering Blogs
function renderingBlogs() {
    allBlogsSec.innerHTML = '';
    console.log(allBlogs);
    allBlogs.forEach((blog, index) => {

        allBlogsSec.innerHTML += `
        
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
                        <button id="see-all-btn" class="text-sm text-[#7749F8]"> See all from this user </button>
                    </div>
    
                </div>
        `
    });

    const seeAllBtn = document.querySelectorAll('#see-all-btn');

    seeAllBtn.forEach((btn, index) => {

        btn.addEventListener('click', () => {
            console.log(index);
            console.log(allBlogs[index].userData.uid);

            let specificUser = JSON.stringify(allBlogs[index].userData.uid);
            localStorage.setItem('specificUser', specificUser);
            window.location = 'userblogs.html';
        })
    });
};