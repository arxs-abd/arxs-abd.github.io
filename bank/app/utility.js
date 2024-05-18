async function hashPassword(password) {
	const encoder = new TextEncoder()
	const data = encoder.encode(password)
	const hash = await crypto.subtle.digest('SHA-256', data)
	const hashArray = Array.from(new Uint8Array(hash))
	const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
	return hashHex
}

function getQueryParams(field) {
	// Dapatkan URL saat ini
	const url = window.location.href

	// Buat objek URL
	const urlObj = new URL(url)

	// Gunakan URLSearchParams untuk mendapatkan query parameters
	const params = new URLSearchParams(urlObj.search)

	// Buat objek untuk menyimpan parameter
	const queryParams = {}

	// Iterasi melalui semua parameter
	params.forEach((value, key) => {
		queryParams[key] = value
	})

	return queryParams[field] ?? null

	return queryParams
}

export { hashPassword, getQueryParams }
