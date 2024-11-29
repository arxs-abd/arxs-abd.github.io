// VARIABLES
let score = {
  home: 0,
  away: 0
}
let startY = 0
let endY = 0

// SELECTOR
const settingsButton = document.querySelector('.setting')
const settingsPanel = document.querySelector('#settings-panel')
const homeTeam = document.querySelector('#home')
const awayTeam = document.querySelector('#away')
const homeTeamScore = homeTeam.querySelector('.team-score')
const awayTeamScore = awayTeam.querySelector('.team-score')

// LISTENERS
homeTeam.addEventListener('click', function() {
  score.home += 1
  updateScore()
})

awayTeam.addEventListener('click', function() {
  score.away += 1
  updateScore()
})

homeTeam.addEventListener('touchstart', (e) => {
  startY = e.touches[0].clientY; // Ambil posisi Y saat touch dimulai
})

homeTeam.addEventListener("touchmove", (e) => {
  endY = e.touches[0].clientY; // Update posisi Y saat swipe bergerak
})

homeTeam.addEventListener('touchend', (e) => {
  if (startY < endY && endY - startY > 50) { // jika swipe ke bawah
    score.home -= 1
    updateScore()
  }
})





settingsButton.addEventListener('click', function() {
  document.getElementById('settings-panel').style.bottom = '0'
})
  
settingsPanel.addEventListener('click', function() {
  document.getElementById('settings-panel').style.bottom = '-100%'
})

// FUNCTIONS
function updateScore() {
  homeTeamScore.innerHTML = score.home
  awayTeamScore.innerHTML = score.away
}