const body = document.querySelector('body')
const text = document.querySelector('button')
text.addEventListener('click', function() {
    fetch(`https://official-joke-api.appspot.com/jokes/programming/random`)
        .then(response => response.json())
        .then(function(res) {
            console.log("Tes");
            text.innerText = res[0].punchline
    })

})