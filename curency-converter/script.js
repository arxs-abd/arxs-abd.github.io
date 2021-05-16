const curencyInputFirst = document.querySelector('#currency-first')
const curencyInputSecond = document.querySelector('#currency-second')
const currencyOptionFirst = document.querySelector('#select-currency-first')
const currencyOptionSecond = document.querySelector('#select-currency-second')
const confirmButton = document.querySelector('button')
const containerFrom = document.querySelector('.container-result span')
const containerTo = document.querySelector('.container-result h2')

fetch('https://api.frankfurter.app/currencies')
    .then(data => data.json())
    .then(data => {
        let newData = Object.entries(data)
        newData.forEach(function(dat, i) {
            // Create Option
            const newOption = document.createElement('option')
            newOption.value = dat[0]
            newOption.innerText = `${dat[1]} (${dat[0]})`
            newOption.setAttribute('data-full', dat[1])
            currencyOptionFirst.append(newOption)
            
            const newOption2 = document.createElement('option')
            newOption2.value = dat[0]
            newOption2.innerText =`${dat[1]} (${dat[0]})`
            newOption2.setAttribute('data-full', dat[1])
            currencyOptionSecond.append(newOption2)

    })
})

curencyInputFirst.addEventListener('keyup', function() {
    curencyInputSecond.value = ''
})

curencyInputSecond.addEventListener('click', function() {
    curencyInputFirst.value = ''
})

function getByInput() {
    if (currencyOptionFirst.value == currencyOptionSecond.value) {
        console.log('Fail')
        return
    }
    const currency = curencyInputFirst.value != '' ? curencyInputSecond : curencyInputFirst
    const amount = curencyInputFirst.value != '' ? curencyInputFirst.value : curencyInputSecond.value
    const from = curencyInputFirst.value != '' ? currencyOptionFirst : currencyOptionSecond
    const to = from == currencyOptionFirst ? currencyOptionSecond : currencyOptionFirst
    // console.log(`Convert amount ${amount} from ${from} to ${to}`)
    const host = 'api.frankfurter.app';
    fetch(`https://${host}/latest?amount=${amount}&from=${from.value}&to=${to.value}`)
        .then(data => data.json())
        .then((data) => {
            let result = Object.values(data.rates)
            currency.value = result[0]
        })
}

confirmButton.addEventListener('click', function() {
    if (currencyOptionFirst.value == currencyOptionSecond.value) {
        console.log('Fail')
        return
    }
    const currency = curencyInputFirst.value != '' ? curencyInputSecond : curencyInputFirst
    const amount = curencyInputFirst.value != '' ? curencyInputFirst.value : curencyInputSecond.value
    const from = curencyInputFirst.value != '' ? currencyOptionFirst : currencyOptionSecond
    const to = from == currencyOptionFirst ? currencyOptionSecond : currencyOptionFirst
    // console.log(`Convert amount ${amount} from ${from} to ${to}`)
    const host = 'api.frankfurter.app';
    fetch(`https://${host}/latest?amount=${amount}&from=${from.value}&to=${to.value}`)
        .then(data => data.json())
        .then((data) => {
            let result = Object.values(data.rates)
            currency.value = result[0]
        })
})