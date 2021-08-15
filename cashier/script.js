const addItems = document.querySelector('div.add')
const containerItems = document.querySelector('.container-items')
const containerCheckout = document.querySelector('.container-checkout')

addItems.addEventListener('click', function() {
    const itemCard = document.createElement('div')
    itemCard.classList.add('item-card', 'border')

    const h2 = document.createElement('h2')
    h2.innerHTML = 'Ayam'
    itemCard.appendChild(h2)

    const span = document.createElement('span')
    span.innerHTML = 'Rp. 20.000'
    itemCard.appendChild(span)

    itemCard.addEventListener('click', function() {
        const checkoutItem = document.createElement('div')
        checkoutItem.classList.add('checkout-item')
        
        const checkItem = document.createElement('div')
        checkItem.classList.add('check-item')

    })

    containerItems.insertBefore(itemCard, containerItems.childNodes[0])
    
})
