console.log('ok')
const addBudgetButton = document.querySelector('#addBudget')
const containerItems = document.querySelector('.container-items')

let data = []

addBudgetButton.addEventListener('click', function(e) {
    // containerItems.appendChild(createInputBudget())
    // console.log(node)
    containerItems.insertBefore(createInputBudget(), containerItems.firstElementChild)
})


function createInputBudget() {
    const div = document.createElement('div')
    div.classList.add('add', 'border')

    const divGroupForBudgetName = document.createElement('div')
    divGroupForBudgetName.classList.add('input-group')
    const spanForBudgetName = document.createElement('span')
    spanForBudgetName.classList.add('card-text')
    spanForBudgetName.innerText = 'Input Budget Name'
    const inputForBudgetName = document.createElement('input')
    inputForBudgetName.id = 'budget-name'
    divGroupForBudgetName.appendChild(spanForBudgetName)
    divGroupForBudgetName.appendChild(inputForBudgetName)

    const divGroupForBudgetPrice = document.createElement('div')
    divGroupForBudgetPrice.classList.add('input-group')
    const spanForBudgetPrice = document.createElement('span')
    spanForBudgetPrice.classList.add('card-text')
    spanForBudgetPrice.innerText = 'Input Budget Price'
    const inputForBudgetPrice = document.createElement('input')
    inputForBudgetName.id = 'budget-price'
    divGroupForBudgetPrice.appendChild(spanForBudgetPrice)
    divGroupForBudgetPrice.appendChild(inputForBudgetPrice)

    const divGroupForButton = document.createElement('div')
    divGroupForButton.classList.add('input-group')
    const buttonInput = document.createElement('button')
    buttonInput.innerText = 'Enter'
    const buttonClose = document.createElement('button')
    buttonClose.innerText = 'Close'
    divGroupForButton.appendChild(buttonInput)
    divGroupForButton.appendChild(buttonClose)

    div.appendChild(divGroupForBudgetName)
    div.appendChild(divGroupForBudgetPrice)
    div.appendChild(divGroupForButton)

    buttonClose.addEventListener('click', function(e) {
        div.remove()
    })

    buttonInput.addEventListener('click', function(e) {
        console.log(inputForBudgetName.value, inputForBudgetPrice.value)
        containerItems.appendChild(createBudgetComponent(inputForBudgetName.value, inputForBudgetPrice.value))
        div.remove()
    })

    return div
}

function createBudgetComponent(name, price) {
    const div = document.createElement('div')
    div.classList.add('item-card', 'border')

    const spanForBudgetName = document.createElement('span')
    spanForBudgetName.classList.add('card-text')
    spanForBudgetName.innerText = name
    div.appendChild(spanForBudgetName)

    const spanForBudgetPrice = document.createElement('span')
    spanForBudgetPrice.classList.add('card-price')
    spanForBudgetPrice.innerText = ` Rp. 0 / Rp. ${formatNumber(price)}`
    div.appendChild(spanForBudgetPrice)

    const divForProgress = document.createElement('div')
    divForProgress.classList.add('progress')
    const divForProgressProgress = document.createElement('div')
    divForProgressProgress.classList.add('progress-stats')
    divForProgressProgress.style.width = `0%`
    divForProgress.appendChild(divForProgressProgress)
    div.appendChild(divForProgress)

    const divGroupForButton = document.createElement('div')
    divGroupForButton.classList.add('input-group')
    const buttonAdd = document.createElement('button')
    buttonAdd.innerText = 'Add Expense'
    const buttonView = document.createElement('button')
    buttonView.innerText = 'View Expense'
    divGroupForButton.appendChild(buttonAdd)
    divGroupForButton.appendChild(buttonView)
    div.appendChild(divGroupForButton)

    return div

}

function formatNumber(num) {
	return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
}

// <div class="item-card border">
    // <span class="card-text">Liburan</span>
    // <span class="card-price">Rp. 500 / Rp. 40.000</span>
    // <div class="progress">
    //     <div class="progress-stats danger">
    //     </div>
    // </div>
    // <div class="input-group">
    //     <button>Add Expense</button>
    //     <button>View Expense</button>
    // </div>
// </div>