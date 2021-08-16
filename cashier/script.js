const addItems = document.querySelector('div.add')
const containerItems = document.querySelector('.container-items')
const containerCheckout = document.querySelector('.container-checkout')
const allPriceText = document.querySelector('.checkout-total h3')

let totalPrice = 0

let allItems = localStorage.getItem('all-items') == null ? [] : JSON.parse(localStorage.getItem('all-items'))

renderItems()

addItems.addEventListener('click', function() {
    const itemCard = document.createElement('div')
    itemCard.classList.add('item-card', 'border')

    const h2 = document.createElement('h2')
    h2.innerHTML = prompt('Enter Name Product')
    itemCard.appendChild(h2)
    
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
    
})

function itemListener(itemC) {
    if (containerCheckout.children[0].classList.contains('first')) {
        containerCheckout.children[0].remove()
    }

    const price = parseInt(itemC.dataset.price)
    totalPrice += price
    allPriceText.innerHTML = `Rp. ${formatNumber(totalPrice)}`

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

    containerCheckout.insertBefore(checkoutItem, containerCheckout.childNodes[containerCheckout.childNodes.length - 2])
    
    removeFromCheckout.addEventListener('click', function() {
        removeFromCheckout.parentElement.parentElement.remove()

        totalPrice -= parseInt(h2AddItems.innerText * price)
        allPriceText.innerHTML = `Rp. ${totalPrice}`
    })

    addButton.addEventListener('click', function() {
        h2AddItems.innerText = parseInt(h2AddItems.innerText) + 1
        spanAllPrice.innerText = `Rp. ${formatNumber(parseInt(h2AddItems.innerText) * price)}`
        totalPrice += price
        allPriceText.innerHTML = `Rp. ${formatNumber(totalPrice)}`
    })
    
    removeButton.addEventListener('click', function() {
        totalPrice -= (h2AddItems.innerText == '1' ? 0 : price)
        allPriceText.innerHTML = `Rp. ${formatNumber(totalPrice)}`
        h2AddItems.innerText = parseInt(h2AddItems.innerText) - (h2AddItems.innerText == '1' ? 0 : 1)
        spanAllPrice.innerText = `Rp. ${formatNumber(parseInt(h2AddItems.innerText) * price)}`
    })
}

function formatNumber(num) {
	return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
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

            itemCard.addEventListener('click', function() {
                itemListener(this)
            })

            containerItems.insertBefore(itemCard, containerItems.childNodes[0])
            
        })

    }
}