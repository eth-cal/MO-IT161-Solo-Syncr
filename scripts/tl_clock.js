/* TODO: Make this update every minute? */
const dayShorthands = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

let currentDate = new Date();

/** 
 * @param {Date} date
 * @return {string}
*/
function formatted_date(date) {
    let hour = currentDate.getHours();
    let halfday = (hour - 1) % 12 + 1;
    let meridiem = (hour >= 12)? 'PM' : 'AM';
    return `${dayShorthands[currentDate.getDay()]}, ${monthNames[currentDate.getMonth()]} ${currentDate.getDate()}, ${currentDate.getFullYear()} | ${(currentDate.getHours() - 1) % 12 + 1}:${currentDate.getMinutes()} ${meridiem}`;
}

document.getElementById("tl-mode.timescr.datetime").textContent = formatted_date();