import { faker } from 'https://esm.sh/@faker-js/faker'

// console.log(faker.person.firstName())

for (let i = 0; i < 100; i++) {
	USER_MODEL_DB.create({
		name: faker.person.fullName(),
		email: faker.internet.email(),
		password: faker.internet.password(),
		balance: Number(faker.finance.amount()),
		role: 'admin',
	})
}
