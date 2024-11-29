// VARIABLES
let SETTINGS = {
  game : {
    increment: 1,
  },
  home : {
    name: 'Player 1',
    color : '#2196f3',
    score: 0,
  },
  away : {
    name: 'Player 2',
    color : '#f44235',
    score: 0,
  }
}

let startYHome = 0
let endYAway = 0
let startYAway = 0
let endYHome = 0

// SELECTOR
const settingsButton = document.querySelector('.setting')
const closeSettingsButton = document.querySelector('#close-settings')
const settingsPanel = document.querySelector('#settings-panel')
const homeTeam = document.querySelector('#home')
const awayTeam = document.querySelector('#away')
const homeTeamScore = homeTeam.querySelector('.team-score')
const awayTeamScore = awayTeam.querySelector('.team-score')
const fullScreenButton = document.querySelector('#full')

// LISTENERS
homeTeam.addEventListener('click', function() {
  updateScore('home', true)
  updateScore()
})

awayTeam.addEventListener('click', function() {
  updateScore('away', true)
  updateScore()
})

detectSwipe(homeTeam, 'home')
detectSwipe(awayTeam, 'away')

settingsButton.addEventListener('click', function() {
  document.getElementById('settings-panel').style.bottom = '0'
})
  
closeSettingsButton.addEventListener('click', function() {
  document.getElementById('settings-panel').style.bottom = '-100%'
})

fullScreenButton.addEventListener('click', function() {
  if (document.fullscreenElement) {
    document.exitFullscreen()
  } else {
    document.body.requestFullscreen()
  }
})

// FUNCTIONS
function updateScore(type, isPlus) {
  if (type === 'home') SETTINGS.home.score += isPlus ? SETTINGS.game.increment : SETTINGS.game.increment * -1
  else if (type === 'away') SETTINGS.away.score += isPlus ? SETTINGS.game.increment : SETTINGS.game.increment * -1
  homeTeamScore.innerHTML = SETTINGS.home.score
  awayTeamScore.innerHTML = SETTINGS.away.score
}

function detectSwipe(selector, type) {
  selector.addEventListener('touchstart', (e) => {
    if (type === 'home') {
      startYHome = e.touches[0].clientY
    } else if (type === 'away') {
      startYAway = e.touches[0].clientY
    }
  })
  
  selector.addEventListener('touchmove', (e) => {
    if (type === 'home') {
      endYHome = e.touches[0].clientY
    } else if (type === 'away') {
      endYAway = e.touches[0].clientY
    }
  })
  
  selector.addEventListener('touchend', (e) => {
    // if (startY < endY && endY - startY > 50) {
    //   updateScore(type, false)
    //   updateScore()
    // }
    if (type === 'home') {
      if (startYHome < endYHome && endYHome - startYHome > 50) {
        updateScore(type, false)
        updateScore()
        startYHome = 0
        endYHome = 0
      }
    } else if (type === 'away') {
      if (startYAway < endYAway && endYAway - startYAway > 50) {
        updateScore(type, false)
        updateScore()
        startYAway = 0
        endYAway = 0
      }
    }
  })
}