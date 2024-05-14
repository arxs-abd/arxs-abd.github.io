// USERS
const ENUM_ROLES_USER = ['admin', 'user']
const USER_MODEL_DB = new DB('users', {
	name: 'string',
	email: 'string',
	password: 'string',
	balance: 'number',
	role: 'enum' + ':' + ENUM_ROLES_USER,
	createdAt: 'string',
	updatedAt: 'string',
})

// TRANSACTIONS
const ENUM_TRANSACTION_TYPES_TRANSACTION = ['deposit', 'withdrawl', 'transfer']
const TRANSACTION_MODEL_DB = new DB('transactions', {
	user_id: 'string',
	type: 'enum' + ':' + ENUM_TRANSACTION_TYPES_TRANSACTION,
	amount: 'number',
	description: 'string',
	balance: 'number',
	createdAt: 'string',
})
