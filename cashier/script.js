const addItems = document.querySelector('div.add')
const containerItems = document.querySelector('.container-items')
const containerCheckout = document.querySelector('.container-checkout')
const subTotal = document.querySelector('.checkout-sub')
const allSubPrice = document.querySelector('.checkout-sub h3')
const allPrice = document.querySelector('.checkout-total h3')
const tax = document.querySelector('.checkout-tax h3')

let totalPrice = 0

let allItems = localStorage.getItem('all-items') == null ? [] : JSON.parse(localStorage.getItem('all-items'))

renderItems()

addItems.addEventListener('click', function() {
    const itemCard = document.createElement('div')
    itemCard.classList.add('item-card', 'border')

    const h2 = document.createElement('h2')
    h2.innerHTML = prompt('Enter Name Product')
    itemCard.appendChild(h2)

    // const buttonRemove = document.createElement('button')
    // buttonRemove.innerText = 'Remove'
    // itemCard.appendChild(buttonRemove)
    
    itemCard.dataset.price = prompt('Enter Price Product')
    
    const span = document.createElement('span')
    span.innerHTML = `Rp. ${formatNumber(itemCard.dataset.price)}`
    itemCard.appendChild(span)
    
    const item = {
        item : h2.innerText,
        price : itemCard.dataset.price
    }
    allItems.push(item)

    localStorage.setItem('all-items', JSON.stringify(allItems))

    itemCard.addEventListener('click', function() {
        itemListener(this)
    })

    containerItems.insertBefore(itemCard, containerItems.childNodes[0])

    // buttonRemove.addEventListener('click', function() {
    //     this.parentElement.remove()
    // })
    
})

function itemListener(itemC) {
    if (containerCheckout.children[0].classList.contains('first')) {
        containerCheckout.children[0].remove()
    }

    // Check Item
    let stats = false
    const allCheckouItem = document.querySelectorAll('.check-item')
    allCheckouItem.forEach(function(i) {
        if (i.children[0].innerHTML == itemC.children[0].innerHTML) {
            const card = i.parentElement.children[1].children[0]
            card.children[0].children[1].innerHTML = parseInt(card.children[0].children[1].innerHTML) + 1
            card.children[1].innerText = `Rp. ${formatNumber(parseInt(card.children[0].children[1].innerHTML) * parseInt(itemC.dataset.price))}`
            totalPrice += parseInt(itemC.dataset.price)
            updatePriceAndTax()
            stats = true
            return 
        }
    })

    if (stats) return

    const price = parseInt(itemC.dataset.price)
    totalPrice += price
    updatePriceAndTax()

    const checkoutItem = document.createElement('div')
    checkoutItem.classList.add('checkout-items')
    
    // Div for Check Item
    const checkItem = document.createElement('div')
    checkItem.classList.add('check-item')

    const h2Item = document.createElement('h2')
    h2Item.innerText = itemC.children[0].innerHTML
    checkItem.appendChild(h2Item)

    const spanPrice = document.createElement('span')
    spanPrice.innerText = itemC.children[1].innerHTML 
    checkItem.appendChild(spanPrice)
    // End Div For Check Item

    // Div For Check Total
    const checkTotal = document.createElement('div')
    checkTotal.classList.add('check-total')

    const xConter = document.createElement('div')
    xConter.classList.add('x-conter')
    
    const counter = document.createElement('div')
    counter.classList.add('counter')
    
    const h2AddItems = document.createElement('h2')
    h2AddItems.classList.add('add-items')
    h2AddItems.innerText = '1'
    
    const addButton = document.createElement('button')
    addButton.innerText = '+'
    const removeButton = document.createElement('button')
    removeButton.innerText = '-'
    
    counter.appendChild(addButton)
    counter.appendChild(h2AddItems)
    counter.appendChild(removeButton)
    
    xConter.appendChild(counter)
    
    const spanAllPrice = document.createElement('span')
    spanAllPrice.innerText = itemC.children[1].innerHTML
    xConter.appendChild(spanAllPrice)
    checkTotal.appendChild(xConter)

    const removeFromCheckout = document.createElement('button')
    removeFromCheckout.classList.add('delete-checkout')
    removeFromCheckout.innerText = 'x'
    checkTotal.appendChild(removeFromCheckout)
    // End Div For Check Total
    
    checkoutItem.appendChild(checkItem)
    checkoutItem.appendChild(checkTotal)

    containerCheckout.insertBefore(checkoutItem, subTotal)
    
    removeFromCheckout.addEventListener('click', function() {
        removeFromCheckout.parentElement.parentElement.remove()

        if (containerCheckout.children.length == 3) {
            const div = document.createElement('div')
            div.classList.add('checkout-items', 'first')

            const span = document.createElement('span')
            span.innerText = 'No Items'

            div.appendChild(span)
            containerCheckout.insertBefore(div, containerCheckout.children[0])
        }

        totalPrice -= parseInt(h2AddItems.innerText * price)
        updatePriceAndTax()
    })

    addButton.addEventListener('click', function() {
        h2AddItems.innerText = parseInt(h2AddItems.innerText) + 1
        spanAllPrice.innerText = `Rp. ${formatNumber(parseInt(h2AddItems.innerText) * price)}`
        totalPrice += price
        updatePriceAndTax()
    })
    
    removeButton.addEventListener('click', function() {
        totalPrice -= (h2AddItems.innerText == '1' ? 0 : price)
        updatePriceAndTax()
        h2AddItems.innerText = parseInt(h2AddItems.innerText) - (h2AddItems.innerText == '1' ? 0 : 1)
        spanAllPrice.innerText = `Rp. ${formatNumber(parseInt(h2AddItems.innerText) * price)}`
    })
}

function formatNumber(num) {
	return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
}

function updatePriceAndTax() {
    allSubPrice.innerHTML = `Rp. ${formatNumber(totalPrice)}`
    tax.innerHTML = `Rp. ${formatNumber(totalPrice * 0.1)}`
    allPrice.innerHTML = `Rp. ${formatNumber(totalPrice + (totalPrice * 0.1))}`
}

function renderItems() {
    if (allItems != []) {
        
        allItems.forEach(function(item, i) {
            const itemCard = document.createElement('div')
            itemCard.classList.add('item-card', 'border')
        
            const h2 = document.createElement('h2')
            h2.innerHTML = item.item
            itemCard.appendChild(h2)
            
            itemCard.dataset.price = item.price
            
            const span = document.createElement('span')
            span.innerHTML = `Rp. ${formatNumber(itemCard.dataset.price)}`
            itemCard.appendChild(span)
            
            // const buttonRemove = document.createElement('button')
            // buttonRemove.innerText = 'Remove'
            // itemCard.appendChild(buttonRemove)

            itemCard.addEventListener('click', function() {
                itemListener(this)
            })

            itemCard.addEventListener('contextmenu', function(e) {
                e.preventDefault()
                itemCard.remove()
            })

            containerItems.insertBefore(itemCard, containerItems.childNodes[0])

            // buttonRemove.addEventListener('click', function() {
            //     this.parentElement.remove()
            // })
            
        })

    }
}