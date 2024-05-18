import { USER_MODEL_DB, TRANSACTION_MODEL_DB, CARD_MODEL_DB } from './model.js'
import { hashPassword } from '../app/utility.js'

const LOGIN_CONTROLLER = {
	login: function (username, password) {
		const user = USER_MODEL_DB.findOne('username', username)
		console.log(user)
	},
}

const REGISTER_CONTROLLER = {
	register: async function (data) {
		// Check Username Exist
		const user = USER_MODEL_DB.findOne('username', data.username)
		if (user)
			return {
				status: 'error',
				message: 'Username Already Exist',
			}

		// Validate Data
		const isValid = USER_MODEL_DB.validate(data)
		if (!isValid)
			return {
				status: 'error',
				message: 'Invalid Data',
			}

		// Hash Password
		data.password = await hashPassword(data.password)

		// Create User
		USER_MODEL_DB.create(data)
		console.log('Register Success')

		return {
			status: 'success',
		}
	},
}

export { LOGIN_CONTROLLER, REGISTER_CONTROLLER }
