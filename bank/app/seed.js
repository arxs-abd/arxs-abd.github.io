import { faker } from '../lib/faker.js'
import { USER_MODEL_DB } from './model.js'

// Seed Data
const activate = false

if (activate) {
	for (let i = 0; i < 100; i++) {
		USER_MODEL_DB.create({
			name: faker.person.fullName(),
			email: faker.internet.email(),
			password: faker.internet.password(),
			balance: Number(faker.finance.amount()),
			role: 'admin',
		})
	}
}
