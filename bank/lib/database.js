class DB {
	constructor(table, schema) {
		this.table = table
		this.schema = schema
	}

	// FOR DB
	create(data) {
		// Validate Data
		if (this.validate(data) === false) return logDB('error', 'Invalid Data', null)

		// Generate ID
		const id = +Date.now()

		// Generate Created At & Updated At
		const date = moment().format('DD MMMM YYYY HH:mm:ss')
		data.createdAt = date

		// If Schema have Updated At
		if (this.schema.updatedAt) data.updatedAt = date

		// Save Data
		const newData = { id, ...data }
		const oldData = getItem(this.table) || []
		const dataToSave = [...oldData, newData]
		setItem(this.table, dataToSave)
		logDB('log', 'Data Saved', null)

		return newData
	}

	getAll() {
		// Get All Data
		const data = getItem(this.table)
		if (!data) return logDB('warn', `Data From Tabel ${this.table} Not Found`, null)

		logDB('log', 'Data Found', null)
		return data
	}

	getById(id) {
		// Get All Data
		const data = getItem(this.table)
		if (!data) return logDB('warn', `Data From Tabel ${this.table} Not Found`, null)

		// Find Data By ID
		const finded = data.find((item) => String(item.id) === String(id))
		if (!finded) return logDB('error', `Data From Tabel ${this.table} With id = ${id} Not Found`, null)

		logDB('log', `Data Found With id = ${id}`, null)
		return finded
	}

	updateById(id, newData) {
		// Get All Data
		const data = getItem(this.table)
		if (!data) return logDB('warn', `Data From Tabel ${this.table} Not Found`, null)

		// Find Data By ID
		const index = data.findIndex((item) => String(item.id) === String(id))
		if (index === -1) return logDB('error', `Data From Tabel ${this.table} With id = ${id} Not Found`, null)

		// If Schema have Updated At
		if (this.schema.updatedAt) data.updatedAt = date

		// Set Data
		data[index] = newData
		setItem(this.table, data)

		return newData
	}

	deleteById(id) {
		// Get All Data
		const data = getItem(this.table)
		if (!data) return logDB('warn', `Data From Tabel ${this.table} Not Found`, null)

		// Filter Data By ID
		const newData = data.filter((item) => String(item.id) !== String(id))
		if (data.length === newData.length) logDB('error', `Data From Tabel ${this.table} With id = ${id} Not Found`, null)

		// Set Data
		setItem(this.table, newData)

		return newData
	}

	// FOR SCHEMA
	validate(data) {
		const keys = Object.keys(data)
		const schemaKeys = Object.keys(this.schema)

		for (const d in data) {
			// Validate Key
			if (!schemaKeys.includes(d)) return logDB('error', `Invalid Key ${d}`, false)

			// Validate Value
			const type = this.schema[d]

			// For Custom Type
			if (type.startsWith('enum')) {
				const enumValues = type.split(':')[1].split(',')
				if (!enumValues.includes(data[d])) return logDB('error', `Invalid Value ${d} With Enum ${enumValues}`, false)
			}
			// For Regular Type
			else {
				if (typeof data[d] !== type) return logDB('error', `Invalid Value ${d} With Type ${type}`, false)
			}
		}

		return true
	}
}

// DB UTILITY
function getItem(table) {
	return JSON.parse(localStorage.getItem(table))
}

function setItem(table, data) {
	localStorage.setItem(table, JSON.stringify(data))
}

function logDB(type, message, returnValue) {
	if (type === 'error') {
		console.error(message)
		return returnValue
	} else if (type === 'warn') {
		console.warn(message)
		return returnValue
	} else if (type === 'log') {
		console.log(message)
	}
}
