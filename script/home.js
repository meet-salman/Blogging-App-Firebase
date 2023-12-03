const goodTime = document.querySelector('#good-time');


const rightNow = new Date();
// const rightNow = new Date('5 Jan 2012, 12:25 AM');

let hours = rightNow.getHours();
const minutes = rightNow.getMinutes();
const amPM = hours >= 12 ? 'PM' : 'AM';

// console.log(`${hours} : ${minutes} ${amPM}`);


if (amPM === 'AM' && hours >= 4 && hours < 12) {

    goodTime.innerHTML = 'Good Morning Readers'

} else if (amPM === 'PM' && hours >= 12 && hours < 16) {

    hours = hours % 12;
    goodTime.innerHTML = 'Good After Noon Readers'

} else if (amPM === 'PM' && hours >= 16 && hours < 20) {

    hours = hours % 12;
    goodTime.innerHTML = 'Good Evening Readers'

} else {
    hours = hours % 12;
    goodTime.innerHTML = 'Good Night Readers'
}
