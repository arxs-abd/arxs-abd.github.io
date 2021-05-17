const cityWeather = document.querySelector('span#city')
const tempWeather = document.querySelector('span#temp')
const descWeather = document.querySelector('span#desc')
const imgWeather = document.querySelector('img')

const APIKEY = '6352b67d76f24097913c9d5997748cc1' 

navigator.geolocation.getCurrentPosition((pos) => {
    const lat = pos.coords.latitude
    const lon = pos.coords.longitude

    fetch(`https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lon}&key=${APIKEY}&lang=en&include=minutely`)
        .then(data => data.json())
        .then(data => {
            const weather = data.data[0]
            // console.log(weather)
            cityWeather.innerHTML = weather.city_name
            tempWeather.innerHTML = `${weather.temp}&#176 C`
            descWeather.innerHTML = weather.weather.description
            imgWeather.src = ` https://www.weatherbit.io/static/img/icons/${weather.weather.icon}.png`
        })
})