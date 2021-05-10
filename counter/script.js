const counterNumber = document.querySelector('h4#counter')
const counterPlus = document.querySelector('button#plus')
const counterMinus = document.querySelector('button#minus')
const counterInput = document.querySelector('input#counterInput')
const counterChange = document.querySelector('button#counterChangeNumber')
const counterReset = document.querySelector('#reset')

let allData = {
    count : 0,
    allCount : 0
}

const newSpan = document.createElement('span')
newSpan.innerHTML = `You Have Count <br> ${allData.allCount} Times`
document.querySelector('.box').append(newSpan)

if (localStorage.getItem('counter') !== null) {
    data = JSON.parse(localStorage.getItem('counter'));
    allData.count = parseInt(data.count)
    allData.allCount = parseInt(data.allCount)
    counterNumber.innerHTML = allData.count;
    newSpan.innerHTML = `You Have Count <br> ${allData.allCount} Times`
}

counterPlus.addEventListener('click', function() {
    allData.count += 1;
    render(1);
});

counterMinus.addEventListener('click', function() {
    allData.count -= 1;
    render(1);
});

counterInput.addEventListener('keyup', function() {
    let newCounter = (counterInput.value === '') ? 0 : counterInput.value ;
    allData.count = parseInt(newCounter);
    render();
});

counterReset.addEventListener('click', function() {
    allData.count = 0
    render(1);
})

function render(status = 0) {
    counterNumber.innerHTML = allData.count;
    if (status != 0) {
        allData.allCount += 1;
        counterInput.value = ''
    }
    localStorage.setItem('counter', JSON.stringify(allData));
    newSpan.innerHTML = `You Have Count <br> ${allData.allCount} Times`

}