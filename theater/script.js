const seatMovieContainer = document.querySelector('.seat-container')
const listMovieContainer = document.querySelector('.list-movie')
const noSelect = document.querySelector('.no-select')
let film = (localStorage.getItem('film') != null) ? JSON.parse(localStorage.getItem('film')) : []

renderFilm()

function renderFilm() {
    if (film.length == 0) {
        
    }
}

function addMovie() {
    listMovieContainer.appendChild(addItems())
}

function addItems() {
    // Create New Items
    const title = prompt('Masukkan Judul Film :')
    const div = document.createElement('div')
    div.classList.add('items')
    const h1 = document.createElement('h1')
    h1.innerText = title
    div.appendChild(h1)

    // Save
    film.push(title)
    localStorage.setItem('film', JSON.stringify(film))

    // Event Listener
    div.addEventListener('click', function() {
        this.classList.toggle('selected')
        if (seatMovieContainer.children.length <= 0) createSeatButton()
        
    })

    return div;
}

function createButton(name, className) {
    const button = document.createElement('button')
    button.innerHTML = name
    button.classList.add(className)
    return button
}

function createSeatButton() {
    for(let i = 0; i < 24; i++) {
        seatMovieContainer.appendChild(createButton(i + 1, 'seat'))
    }
    noSelect.remove()
}