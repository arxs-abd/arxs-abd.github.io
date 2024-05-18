function createElement(tagName, attributes = {}, children = []) {
	// Membuat elemen baru dengan tagName yang diberikan
	const element = document.createElement(tagName)

	// Menambahkan atribut ke elemen
	for (const [key, value] of Object.entries(attributes)) {
		if (key.startsWith('on') && typeof value === 'function') {
			// Jika atribut adalah event listener (misalnya 'onclick'), tambahkan event listener
			element.addEventListener(key.slice(2).toLowerCase(), value)
		} else {
			// Tambahkan atribut biasa
			element.setAttribute(key, value)
		}
	}

	// Menambahkan anak-anak (children) ke elemen
	children.forEach((child) => {
		if (typeof child === 'string' || typeof child === 'number') {
			// Jika child adalah string atau number, tambahkan sebagai teks
			element.appendChild(document.createTextNode(child))
		} else if (child instanceof HTMLElement) {
			// Jika child adalah elemen HTML, tambahkan sebagai anak
			element.appendChild(child)
		}
	})

	return element
}

export default createElement
