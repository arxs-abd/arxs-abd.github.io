// GAME
const SCORE = {
    A1 : 30, A2 : 40, A3 : 50, A4 : 60, A5 : 70,
    B1 : 30, B2 : 40, B3 : 50, B4 : 60, B5 : 70,
    C1 : 30, C2 : 40, C3 : 50, C4 : 60, C5 : 70,
    D1 : 30, D2 : 40, D3 : 50, D4 : 60, D5 : 70,
    E1 : 30, E2 : 40, E3 : 50, E4 : 60, E5 : 70,
}

// SCENE
const startScene = document.querySelector('.scene-awal')
const mainScene = document.querySelector('.scene-main')
const soalScene = document.querySelector('.scene-soal')
const soalDetailScene = document.querySelector('.scene-soal-detail')

// BUTTON COMPONENT
const startButton = document.querySelector('#start')
const closeSoalButton = document.querySelector('.close')
const scoreChanger = document.querySelectorAll('.score-changer')

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
const scoreSoal = document.querySelector('.score-soal')
const lokasiSoal = document.querySelector('.lokasi-soal')

// MATRIX COMPONNET
const allMatrix = document.querySelectorAll('.box')

// SOAL COMPONENT
const soal = document.querySelector('.soal-panel')

// GAMPEPLAY
const PLAYER_1 = {
    name: '',
    score: 0,
    textScore : player1TextScore,
    isPlay : false
}
const PLAYER_2 = {
    name: '',
    score: 0,
    textScore : player2TextScore,
    isPlay : false
}
const PLAYER_3 = {
    name: '',
    score: 0,
    textScore : player3TextScore,
    isPlay : false
}

const PLAYER_MAP = {
    1 : PLAYER_1,
    2 : PLAYER_2,
    3 : PLAYER_3,
}

let CURRENT_LOCATION = ''

const FIELD = [
    0, 0, 0, 0, 0,
    0, 0, 0, 0, 0,
    0, 0, 0, 0, 0,
    0, 0, 0, 0, 0,
    0, 0, 0, 0, 0,
]

// To set temp score
let TEMP_SCORE = 0

// To check is second turn
let IS_SECOND_TURN = false

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

// WHEN MATRIX CLICKED
for (const matrix of allMatrix) {
    matrix.addEventListener('click', () => {
        // Hide Soal Scene
        soalScene.classList.add('hidden')

        // Show Soal Detail Scene
        soalDetailScene.classList.remove('hidden')

        // Show Score Changer
        showScoreChanger(true)

        // Set Soal
        soal.style.backgroundImage = `url(soal/${matrix.textContent}.png)`

        // Set Soal
        const score = SCORE[matrix.textContent]
        TEMP_SCORE = score
        scoreSoal.textContent = `Skor : ${score}`
        lokasiSoal.textContent = matrix.textContent

        // Set Current Location
        CURRENT_LOCATION = matrix.textContent
    })
}

// WHEN CLOSE SOAL BUTTON CLICKED
closeSoalButton.addEventListener('click', () => {
    closeButton()
    setColorMatrix(0)
})

// WHEN SCORE CHANGER CLICKED
for (const score of scoreChanger) {
    for (const button of score.children) {
        button.addEventListener('click', () => {
            const type = button.dataset.type
            const player = button.dataset.player

            // If Plus Button Set
            if (type === 'plus') {
                if (!IS_SECOND_TURN) {
                    setNewScore(PLAYER_MAP[player], TEMP_SCORE)
                }
                else {
                    setNewScore(PLAYER_MAP[player], TEMP_SCORE / 2)
                    IS_SECOND_TURN = false
                }
                PLAYER_MAP[player].isPlay = true
                setColorMatrix(player)
                isComplete()
                closeButton()
            } else {
                if (!IS_SECOND_TURN) {
                    setNewScore(PLAYER_MAP[player], -TEMP_SCORE / 2)
                    IS_SECOND_TURN = true
                } else {
                    setNewScore(PLAYER_MAP[player], -TEMP_SCORE)
                    IS_SECOND_TURN = false
                    setColorMatrix(0)
                    closeButton()
                }
                PLAYER_MAP[player].isPlay = true
            }
        })
    }
}

// UTILITY
function closeButton() {
    // Hide Soal Detail Scene
    soalDetailScene.classList.add('hidden')

    // Hide Score Changer
    showScoreChanger(false)

    // Show Soal Scene
    soalScene.classList.remove('hidden')

    // Reset IS SECOND TURN
    IS_SECOND_TURN = false
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

function setColorMatrix(player) {
    allMatrix[transformLocation(CURRENT_LOCATION)].dataset.player = player
    FIELD[transformLocation(CURRENT_LOCATION)] = player
}

function transformLocation(location) {
    const [x, y] = location.split('')
    const xIndex = ['A', 'B', 'C', 'D', 'E'].indexOf(x)
    const yIndex = ['1', '2', '3', '4', '5'].indexOf(y)

    return ((xIndex * 5) + (yIndex + 1)) - 1
}

function isComplete() {
    if (
        ((FIELD[0] === FIELD[1] && FIELD[1] === FIELD[2] && FIELD[2] === FIELD[3] && FIELD[3] === FIELD[4] && FIELD[0]) ||
        (FIELD[5] === FIELD[6] && FIELD[6] === FIELD[7] && FIELD[7] === FIELD[8] && FIELD[8] === FIELD[9] && FIELD[5]) ||
        (FIELD[10] === FIELD[11] && FIELD[11] === FIELD[12] && FIELD[12] === FIELD[13] && FIELD[13] === FIELD[14] && FIELD[14]) ||
        (FIELD[15] === FIELD[16] && FIELD[16] === FIELD[17] && FIELD[17] === FIELD[18] && FIELD[18] === FIELD[19] && FIELD[19]) ||
        (FIELD[20] === FIELD[21] && FIELD[21] === FIELD[22] && FIELD[22] === FIELD[23] && FIELD[23] === FIELD[24] && FIELD[24]) ||
        (FIELD[0] === FIELD[5] && FIELD[5] === FIELD[10] && FIELD[10] === FIELD[15] && FIELD[15] === FIELD[20] && FIELD[20]) ||
        (FIELD[1] === FIELD[6] && FIELD[6] === FIELD[11] && FIELD[11] === FIELD[16] && FIELD[16] === FIELD[21] && FIELD[21]) ||
        (FIELD[2] === FIELD[7] && FIELD[7] === FIELD[12] && FIELD[12] === FIELD[17] && FIELD[17] === FIELD[22] && FIELD[22]) ||
        (FIELD[3] === FIELD[8] && FIELD[8] === FIELD[13] && FIELD[13] === FIELD[18] && FIELD[18] === FIELD[23] && FIELD[23]) ||
        (FIELD[4] === FIELD[9] && FIELD[9] === FIELD[14] && FIELD[14] === FIELD[19] && FIELD[19] === FIELD[24] && FIELD[24]) ||
        (FIELD[0] === FIELD[6] && FIELD[6] === FIELD[12] && FIELD[12] === FIELD[18] && FIELD[18] === FIELD[24] && FIELD[24]) ||
        (FIELD[4] === FIELD[8] && FIELD[8] === FIELD[12] && FIELD[12] === FIELD[16] && FIELD[16] === FIELD[20] && FIELD[20])
        )) {
        console.log('Selesai')
    }
}

// document.addEventListener('keydown', function(event) {
//     if (event.ctrlKey && (event.key === 'r' || event.key === 'R') || event.key === 'F5') {
//         event.preventDefault()
//     }
// });