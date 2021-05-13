// Component
const setTime = document.querySelector('#set')
const containerSetTime = document.querySelector('.container-set')
const set = document.querySelector('#setTimer')
const startTimer = document.querySelector('#start')
const stopTimer = document.querySelector('#stop')
const progresBar = document.querySelector('progress')

// Shown Timer
const showHour = document.querySelector('span#hour')
const showMinute = document.querySelector('span#minute')
const showSecond = document.querySelector('span#second')

// Time
let hour = 0
let minute = 0
let second = 0

let totalTime = 0

// Timer
let timer = null


setTime.addEventListener('click', function() {
    containerSetTime.classList.toggle('none')
})

set.addEventListener('click', function() {
    // Get Time
     hour = document.querySelector('#setHour').value;
     minute = document.querySelector('#setMinute').value;
     second = document.querySelector('#setSecond').value;

    // Inner to Timer App
    showHour.innerHTML = formatZero(hour)
    showMinute.innerHTML = formatZero(minute)
    showSecond.innerHTML = formatZero(second)
})

startTimer.addEventListener('click', function(){
    progresBar.max = (hour * 60 * 60) + (minute * 60) + parseInt(second)
    // console.log(progresBar.max)
    timer = setInterval(function() {
        if (second > 0) {
            second -= 1
            showSecond.innerHTML = formatZero(second)
            progresBar.value += 1
            
        } else if (hour > 0) {
            hour -= 1
            showHour.innerHTML = formatZero(hour)
            minute = 59
            showMinute.innerHTML = formatZero(minute)
            second = 59
            showSecond.innerHTML = formatZero(second)
            progresBar.value += 1
            
            
        } else if (minute > 0) {
            minute -= 1
            showMinute.innerHTML = formatZero(minute)
            second = 59
            showSecond.innerHTML = formatZero(second)
            progresBar.value += 1
            
            
        } else {
            clearInterval(timer)
        }
    }, 1000)
})

stopTimer.addEventListener('click', function() {
    clearInterval(timer)
})

// Utility
function formatZero(format) {
    return format >= 10 ? format : `0${format}`
}

function stopTimerFunc() {
    clearInterval(timer)
}

