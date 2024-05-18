const AUTH_VALIDATOR_SCHEMA = {
	register: {
		username: {
			type: 'string',
			required: true,
			min: 6,
			max: 20,
		},
		name: {
			type: 'string',
			required: true,
			min: 6,
			max: 20,
		},
		email: {
			type: 'email',
			required: true,
		},
		password: {
			type: 'string',
			required: true,
			// min : 6,
			// max : 20,
		},
	},
}

const VALIDATOR = (schema, data) => {
	const keys = Object.keys(data)
	const schemaKeys = Object.keys(schema)

	for (const schema of schemaKeys) {
	}

	return true
}
