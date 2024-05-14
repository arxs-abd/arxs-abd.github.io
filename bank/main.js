const userDB = new DB('users', {
	name: 'string',
	email: 'string',
	password: 'string',
	balance: 'number',
	role: 'string',
})

moment.locale('id')

// userDB.create({
// 	name: 'John Doe',
// 	email: 'johndo@email.com',
// 	password: '123456',
// 	balance: 1000000,
// 	role: 'admin',
// })

// userDB.deleteById('1715703801008')

console.log(moment().format('DD MMMM YYYY HH:mm:ss'))
