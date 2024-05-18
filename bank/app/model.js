import DB from './database.js'

// USERS
const ENUM_ROLES_USER = ['admin', 'user']
const USER_MODEL_DB = new DB('users', {
	username: 'string',
	name: 'string',
	email: 'string',
	password: 'string',
	balance: 'number',
	role: 'enum' + ':' + ENUM_ROLES_USER,
	createdAt: 'string',
	updatedAt: 'string',
})

// CARD
const ENUM_CARD_TYPES_CARD = ['debit', 'credit']
const CARD_MODEL_DB = new DB('cards', {
	user_id: 'string',
	type: 'enum' + ':' + ENUM_CARD_TYPES_CARD,
	number: 'string',
	expired: 'string',
	cvv: 'string',
	createdAt: 'string',
	updatedAt: 'string',
})

// TRANSACTIONS
const ENUM_TRANSACTION_TYPES_TRANSACTION = ['deposit', 'withdrawl', 'transfer']
const TRANSACTION_MODEL_DB = new DB('transactions', {
	user_id: 'string',
	card_id: 'string',
	type: 'enum' + ':' + ENUM_TRANSACTION_TYPES_TRANSACTION,
	amount: 'number',
	description: 'string',
	balance: 'number',
	createdAt: 'string',
})

export { USER_MODEL_DB, TRANSACTION_MODEL_DB, CARD_MODEL_DB }
