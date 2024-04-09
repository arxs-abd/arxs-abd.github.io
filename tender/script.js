// GAME
const SCORE = {
    CORRECT : 100,
    WRONG : -50
}

// SCENE
const startScene = document.querySelector('.scene-awal')
const mainScene = document.querySelector('.scene-main')
const soalScene = document.querySelector('.scene-soal')
const soalDetailScene = document.querySelector('.scene-soal-detail')

// BUTTON COMPONENT
const startButton = document.querySelector('#start')
const playSoalButton = document.querySelector('.play-soal')
const closeSoalButton = document.querySelector('.close')
const scoreChanger = document.querySelectorAll('.score-changer')
const time30Second = document.querySelector('.btn-time[data-time="30"]')
const time60Second = document.querySelector('.btn-time[data-time="60"]')
const time90Second = document.querySelector('.btn-time[data-time="90"]')
const time120Second = document.querySelector('.btn-time[data-time="120"]')
const prevSoal = document.querySelector('.prev')
const nextSoal = document.querySelector('.next')

const ALLTimeSecond = [time30Second, time60Second, time90Second, time120Second]


// INPUT COMPONENT
const inputPlayer1 = document.querySelector('#player-1-input')
const inputPlayer2 = document.querySelector('#player-2-input')
const inputPlayer3 = document.querySelector('#player-3-input')

// SPAN COMPONENT
// Name
const player1TextName = document.querySelector('#player-1-name')
const player2TextName = document.querySelector('#player-2-name')
const player3TextName = document.querySelector('#player-3-name')
// Score
const player1TextScore = document.querySelector('#player-1-score')
const player2TextScore = document.querySelector('#player-2-score')
const player3TextScore = document.querySelector('#player-3-score')
// Soal
const waktuSoal = document.querySelector('.score-soal')
const lokasiSoal = document.querySelector('.lokasi-soal')
const soalKe = document.querySelector('.soal-ke')
// Reset
const player1Reset = document.querySelector('#player-1-reset-score')
const player2Reset = document.querySelector('#player-2-reset-score')
const player3Reset = document.querySelector('#player-3-reset-score')

// SOAL COMPONENT
const soal = document.querySelector('.soal-panel')

// TIME
let TIME_INTERVAL = null

// GAMPEPLAY
const PLAYER_1 = {
    name: '',
    score: 0,
    textScore : player1TextScore,
    isPlay : false,
    reset : player1Reset
}
const PLAYER_2 = {
    name: '',
    score: 0,
    textScore : player2TextScore,
    isPlay : false,
    reset : player2Reset
}
const PLAYER_3 = {
    name: '',
    score: 0,
    textScore : player3TextScore,
    isPlay : false,
    reset : player3Reset
}

const PLAYER_MAP = {
    1 : PLAYER_1,
    2 : PLAYER_2,
    3 : PLAYER_3,
}

let CURRENT_LOCATION = 1
let IS_RESET = false

const FIELD = [
    0, 0, 0, 0, 0,
    0, 0, 0, 0, 0,
    0, 0, 0, 0, 0,
    0, 0, 0, 0, 0,
    0, 0, 0, 0, 0,
]

// WHEN START BUTTON CLICKED
startButton.addEventListener('click', () => {
    // Get Player Name
    PLAYER_1.name = inputPlayer1.value
    PLAYER_2.name = inputPlayer2.value
    PLAYER_3.name = inputPlayer3.value

    // Set Player Name
    player1TextName.textContent = PLAYER_1.name
    player2TextName.textContent = PLAYER_2.name
    player3TextName.textContent = PLAYER_3.name

    // Hide Start Scene
    startScene.classList.add('hidden')
    // Show Main Scene
    mainScene.classList.remove('hidden')
    // Show Soal Scene
    soalScene.classList.remove('hidden')
})

// WHEN TIME BUTTON CLICKED
for (const button of ALLTimeSecond) {
    button.addEventListener('click', () => {
         // Hide Soal Scene
        soalScene.classList.add('hidden')

        // Show Soal Detail Scene
        soalDetailScene.classList.remove('hidden')

        // SET TIMER
        const time = button.dataset.time
        startTimer(time)
    })
}

// WHEN PLAY BUTTON CLICKED
playSoalButton.addEventListener('click', () => {
    // Hide Soal Scene
    soalScene.classList.add('hidden')
    // Show Soal Detail Scene
    soalDetailScene.classList.remove('hidden')

    // Set Soal Detail
    soal.style.backgroundImage = `url(soal/${CURRENT_LOCATION}.png)`
    startTimer(5)
    lokasiSoal.textContent = 'Soal Ke - ' + CURRENT_LOCATION
})

// WHEN CLOSE SOAL BUTTON CLICKED
closeSoalButton.addEventListener('click', () => {
    closeButton()
})

// WHEN SCORE CHANGER CLICKED
for (const score of scoreChanger) {
    for (const button of score.children) {
        button.addEventListener('click', () => {
            const type = button.dataset.type
            const player = button.dataset.player

            // If Plus Button Set
            if (type === 'plus') {
                PLAYER_MAP[player].isPlay = true
                setNewScore(PLAYER_MAP[player], SCORE.CORRECT)
            } else if (type === 'minus') {
                PLAYER_MAP[player].isPlay = true
                setNewScore(PLAYER_MAP[player], SCORE.WRONG)
            } else if (type === 'reset') {
                if (IS_RESET) {
                    // Hide Reset Input
                    PLAYER_MAP[player].reset.classList.add('hidden')

                    // Reset Score
                    const newScore = Number(PLAYER_MAP[player].reset.value)
                    PLAYER_MAP[player].score = newScore
                    PLAYER_MAP[player].textScore.textContent = setThirdAnswer(newScore)

                    IS_RESET = false
                } else {
                    PLAYER_MAP[player].reset.value = PLAYER_MAP[player].score
                    PLAYER_MAP[player].reset.classList.remove('hidden')
                    IS_RESET = true
                }
            }
        })
    }
}

// WHEN RESET BUTTON CLICKED
[player1Reset, player2Reset, player3Reset].forEach(reset => {
    reset.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            const player = reset.dataset.player

            // Hide Reset Input
            PLAYER_MAP[player].reset.classList.add('hidden')

            // Reset Score
            const newScore = Number(PLAYER_MAP[player].reset.value)
            PLAYER_MAP[player].score = newScore
            PLAYER_MAP[player].textScore.textContent = setThirdAnswer(newScore)

            IS_RESET = false
        }
    })
})

// WHEN PREV OR NEXT BUTTON CLICKED
prevSoal.addEventListener('click', () => {
    if (CURRENT_LOCATION === 1) return

    CURRENT_LOCATION--
    lokasiSoal.textContent = 'Soal Ke - ' + CURRENT_LOCATION
    soalKe.textContent = 'Soal Ke - ' + CURRENT_LOCATION
})

nextSoal.addEventListener('click', () => {
    // if (CURRENT_LOCATION === 25) return

    CURRENT_LOCATION++
    lokasiSoal.textContent = 'Soal Ke - ' + CURRENT_LOCATION
    soalKe.textContent = 'Soal Ke - ' + CURRENT_LOCATION
})

// UTILITY
function closeButton() {
    // Hide Soal Detail Scene
    soalDetailScene.classList.add('hidden')

    // Hide Score Changer
    // showScoreChanger(false)

    // Show Soal Scene
    soalScene.classList.remove('hidden')

    // Clear Interval
    clearInterval(TIME_INTERVAL)
}

function showScoreChanger(type) {
    for (const score of scoreChanger) {
        if (type) score.classList.remove('hide')
        else score.classList.add('hide')
    }
}

function setNewScore(player, score) {
    player.score += score
    player.textScore.textContent = setThirdAnswer(player.score)
}

function setThirdAnswer(score) {
    if (score > 100) return String(score)

    if (score === 0) return '000'

    if (score > 0) {
        let scoreString = String(score)
        for (let i = 0; i < 3 - scoreString.length; i++) {
            scoreString = '0' + scoreString
        }
        return scoreString
    } else {
        let scoreString = String(score * -1)
        for (let i = 0; i < 2 - scoreString.length; i++) {
            scoreString = '0' + scoreString
        }
        return '-' + scoreString
    }
}

function startTimer(duration) {
    waktuSoal.innerHTML = `Waktu <br> ${duration}`
    TIME_INTERVAL = setInterval(() => {
        duration--
        waktuSoal.innerHTML = `Waktu <br> ${duration}`

        if (duration === -1) {
            // clearInterval(interval)
            closeButton()
        }
    }, 1000)

    if (duration === 5) {
        playSoalButton.disabled = true
        for (const button of ALLTimeSecond) {
            button.disabled = false
        }
    }
    else {
        playSoalButton.disabled = false
        for (const button of ALLTimeSecond) {
            button.disabled = true
        }
    }
}

// document.addEventListener('keydown', function(event) {
//     if (event.ctrlKey && (event.key === 'r' || event.key === 'R') || event.key === 'F5') {
//         event.preventDefault()
//     }
// });