const inputContainer = document.getElementById('input-container');
const countdownForm = document.getElementById('countdownForm');
const dateEl = document.getElementById('date-picker');

const countdownEl = document.getElementById('countdown');
const countdownElTitle = document.getElementById('countdown-title');
const countdownBtn = document.getElementById('countdown-button');
const timeElements = document.querySelectorAll('span');

const completeEl = document.getElementById('complete');
const completeElInfo = document.getElementById('complete-info');
const completeBtn = document.getElementById('complete-button');

let countdownTitle = '';
let countdownDate = '';
let countdownValue = new Date();
let countdownActive;
let savedCountdown;

const second = 1000;
const minute = 60 * second;
const hour = 60 * minute;
const day = 24 * hour;

// Set Date Input Min with Today's Date
const today = new Date().toISOString().split('T')[0];
dateEl.min = today;

function displayCountdown() {
    inputContainer.hidden = true;
    countdownEl.hidden = false;
}

function displayInputForm() {
    countdownEl.hidden = true;
    completeEl.hidden = true;
    inputContainer.hidden = false;
}

function displayCountdownComplete() {
    countdownEl.hidden = true;
    inputContainer.hidden = true;
    completeEl.hidden = false;
}

function calculateTimeUnits() {
    const now = new Date().getTime();
    const distance = countdownValue - now;
    const days = Math.floor(distance / day);
    const hours = Math.floor((distance % day) / hour);
    const minutes = Math.floor((distance % hour) / minute);
    const seconds = Math.floor((distance % minute) / second);

    return { distance, days, hours, minutes, seconds};
}

function populateCountdown(timeUnits) {
    const { days, hours, minutes, seconds } = timeUnits;
    countdownElTitle.textContent = countdownTitle;
    timeElements[0].textContent = days;
    timeElements[1].textContent = hours;
    timeElements[2].textContent = minutes;
    timeElements[3].textContent = seconds;
}

// Populate Countdown / Complete UI
function updateDOM() {
    countdownActive = setInterval(() => {
        const timeUnits = calculateTimeUnits();
        const { distance } = timeUnits;

        // Check if countdown is complete
        if (distance < 0) {
            displayCountdownComplete();
            clearInterval(countdownActive);
            completeElInfo.textContent = `${countdownTitle} finished on ${countdownDate}`;
        } else {
            populateCountdown(timeUnits);
            displayCountdown();
        }
    }, 1000);
}

// Update the countdown
function updateCountdown(event) {
    event.preventDefault();
    countdownTitle = event.srcElement[0].value;
    countdownDate = event.srcElement[1].value;
    if (countdownTitle === '') {countdownTitle = 'Untitled'};
    savedCountdown = {
        title: countdownTitle,
        date: countdownDate
    }
    localStorage.setItem('countdown', JSON.stringify(savedCountdown));
    // Get number version of current date, update DOM
    countdownValue = new Date(countdownDate).getTime();
    updateDOM();
}

// Reset
function reset() {
    displayInputForm();
    clearInterval(countdownActive);
    // Reset Values
    countdownTitle = '';
    countdownDate = '';
    localStorage.removeItem('countdown');
}

function restorePreviousCountdown() {
    // Get counutdown from local storage if available
    const savedCountdown = JSON.parse(localStorage.getItem('countdown'))
    if(savedCountdown) {
        inputContainer.hidden = true;
        countdownTitle = savedCountdown.title;
        countdownDate = savedCountdown.date;
        countdownValue = new Date(countdownDate).getTime();
        updateDOM();
    }
}

// On Load, check local storage
restorePreviousCountdown();

// Event Listeners
countdownForm.addEventListener('submit', updateCountdown);
countdownBtn.addEventListener('click', reset);
completeBtn.addEventListener('click', reset);