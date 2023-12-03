const goodTime = document.querySelector('#good-time');

const rightNow = new Date();

let hours = rightNow.getHours();
const minutes = rightNow.getMinutes();
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
