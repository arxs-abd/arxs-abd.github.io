const searchInput = document.querySelector('#search')
const searchButton = document.querySelector('#searchButton')
const containerResult = document.querySelector('.container-card')
const containerDetails = document.querySelector('.container-details')
const favoriteListButton = document.querySelector('#favoriteList')
// console.log(favoriteListButton);

const APIKEY = `d8d7d751910a84dbcde954c01050ac8f`

let favoriteMovie = []

if (localStorage.getItem('fav-movie') != null) {
    favoriteMovie = JSON.parse(localStorage.getItem('fav-movie'))
}

favoriteListButton.addEventListener('click', function() {
    containerResult.innerHTML = ``
    getMovie(favoriteMovie, true)
})

searchInput.addEventListener('keyup', function(e) {
    if (e.keyCode == 13) searchMovie()
})

searchButton.addEventListener('click', searchMovie)

function searchMovie() {
    const search = searchInput.value
    // console.log(search)
    const myApi = `https://api.themoviedb.org/3/search/movie?api_key=${APIKEY}&query=${search}`
    fetch(myApi)
        .then(response => response.json())
        .then(function(data) {
            let movie = data.results
            containerResult.innerHTML = ''
            getMovie(movie)
        });
}

function getMovie(movie, inFavorite = false) {
    movie.forEach(function(mov, i) {
        // Card Div
        const cardDiv = document.createElement('div')
        cardDiv.classList.add('card')
        // Div Image
        const cardImage = document.createElement('div')
        cardImage.classList.add('card-image')
        const imagePoster = document.createElement('img')
        imagePoster.src = (mov.poster_path) ? `http://image.tmdb.org/t/p/w500${mov.poster_path}` : 'https://pesisirbaratkab.go.id/images/system/404.png'
        imagePoster.classList.add('card-img-top')
        imagePoster.alt = mov.original_title
        cardImage.append(imagePoster)
        cardDiv.append(cardImage)

        const spanTitle = document.createElement('span')
        spanTitle.id = 'title'
        spanTitle.innerHTML = mov.original_title
        cardDiv.append(spanTitle)
        const spanRelease = document.createElement('span')
        spanRelease.id = 'release'
        spanRelease.innerHTML = getDate(mov.release_date)
        cardDiv.append(spanRelease)

        const detailMovieButton = document.createElement('button')
        detailMovieButton.setAttribute('data-id', mov.id)
        detailMovieButton.classList.add('details')
        detailMovieButton.innerText = 'Details'
        cardDiv.append(detailMovieButton)
        const favoriteMovieButton = document.createElement('button')
        favoriteMovieButton.setAttribute('data-id', mov.id)
        favoriteMovieButton.classList.add('favorite')
        if (containsLike(mov.id)) favoriteMovieButton.classList.add('like')
        favoriteMovieButton.innerText = 'Favorite'
        cardDiv.append(favoriteMovieButton)

        containerResult.append(cardDiv)

        detailMovieButton.addEventListener('click', function() {
            containerDetails.innerHTML = ``
            const id = this.getAttribute('data-id')
            const apiByID = `https://api.themoviedb.org/3/movie/${id}?api_key=${APIKEY}&language=en-US`
            fetch(apiByID)
                .then(response => response.json())
                .then(function(mov) {
                    if (containerDetails.classList.contains('none')) containerDetails.classList.remove('none')
                    const detailImage = document.createElement('div')
                    detailImage.classList.add('details-img')
                    const image = document.createElement('img')
                    image.src = (mov.poster_path) ? `http://image.tmdb.org/t/p/w500${mov.poster_path}` : 'https://pesisirbaratkab.go.id/images/system/404.png'
                    image.alt = mov.original_title
                    detailImage.append(image)
                    containerDetails.append(detailImage)

                    const spanTitle = document.createElement('span')
                    spanTitle.id = 'title'
                    spanTitle.innerHTML = mov.original_title
                    containerDetails.append(spanTitle)
                    const spanRelease = document.createElement('span')
                    spanRelease.id = 'release'
                    spanRelease.innerHTML = getDate(mov.release_date)
                    containerDetails.append(spanRelease)
                    const spanOverview = document.createElement('span')
                    spanOverview.id = 'overview'
                    spanOverview.innerText = mov.overview
                    containerDetails.append(spanOverview)

                    const closeButton = document.createElement('button')
                    closeButton.id = 'close'
                    closeButton.innerText = 'Close'
                    containerDetails.append(closeButton)

                    closeButton.addEventListener('click', function() {
                        containerDetails.classList.add('none')
                    })
                })
        })

        favoriteMovieButton.addEventListener('click', function() {
            const id = this.getAttribute('data-id')
            this.classList.toggle('like')
            if (this.classList.contains('like')) {
                let newMovieList = {
                    id : mov.id,
                    original_title : mov.original_title,
                    release_date : mov.release_date,
                    poster_path : mov.poster_path,
                    overview : mov.overview,
                }
                favoriteMovie.push(newMovieList)
                localStorage.setItem('fav-movie', JSON.stringify(favoriteMovie))
            } else {
                let newFavoriteMovie = []
                favoriteMovie.forEach(function(fav, i) {
                    if (fav.id + "" !== id + "") newFavoriteMovie.push(fav)
                })
                favoriteMovie = newFavoriteMovie
                localStorage.setItem('fav-movie', JSON.stringify(favoriteMovie))
                // console.log("Tidak Suka")
                if (inFavorite) {
                    cardDiv.remove()
                }
            }
        })

    })
}

function getDate(time) {
    let date = time.split('-')
    return `${date[2]} ${new Date(time).toLocaleDateString('default', { month : 'long'})} ${date[0]}`
}

function containsLike(search) {
    let status = false
    favoriteMovie.forEach(function(fav, i) {
        if (fav.id == search) {
            status = true
            return
        } 
    })
    return status
}