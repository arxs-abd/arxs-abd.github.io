const CONTAINER = document.querySelector('.container-matrix')
const GENERATE = document.querySelector('.generate')

const MAX_LENGTH = 15

// generateMatrix()

GENERATE.addEventListener('click', function() {
    console.log('ok')
    CONTAINER.innerHTML = ''
    generateMatrix()

    html2canvas(CONTAINER).then(canvas => {
        let link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = +new Date() + '-matrix.png';
        link.click();
    });

})

function generateMatrix() {
    for(let i = 0; i < MAX_LENGTH; i++) {
        const ROW = document.createElement('div')
        ROW.classList.add('row')
        for(let j = 0; j < MAX_LENGTH; j++) {
            const BOX = document.createElement('div')
            BOX.classList.add('box')
            const SPAN = document.createElement('span')
            SPAN.textContent = generateRandomNumber(4)
            BOX.appendChild(SPAN)
            ROW.appendChild(BOX)
        }
        CONTAINER.appendChild(ROW)
    }
}

function generateRandomNumber(length) {
    let result = ''
    const characters = '0123456789'
    const charactersLength = characters.length
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
}