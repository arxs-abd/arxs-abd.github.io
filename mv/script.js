const searchInput = document.querySelector('#search')
const searchButton = document.querySelector('#searchButton')
const containerResult = document.querySelector('.container-card')

const APIKEY = `d8d7d751910a84dbcde954c01050ac8f`

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
            let result = ``
            movie.forEach(function(mov, i) {
                result += `<div class="card">
                                <div class="card-image">
                                    <img src="${(mov.poster_path) ? `http://image.tmdb.org/t/p/w500${mov.poster_path}` : 'https://pesisirbaratkab.go.id/images/system/404.png'}" class="card-img-top" alt="${mov.original_title}">
                                </div>
                                <span id="title">${mov.original_title}</span>
                                <span id="release">${getDate(mov.release_date)}</span>
                                <button class="details">Details</button>
                                <button class="favorite">Favorite</button>
                            </div>`
            })
            // console.log(movie);
            containerResult.innerHTML = result
        });
}

function getDate(time) {
    let date = time.split('-')
    return `${date[2]} ${new Date(time).toLocaleDateString('default', { month : 'long'})} ${date[0]}`
}