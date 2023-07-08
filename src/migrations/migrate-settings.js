// Creates basic Settings for database testing.

const mongoose = require('mongoose');
const Setting = require ('../models/Setting.js');

async function migrate() {

	await mongoose.connect(
		process.env.MONGODB_URL,
		{ useNewUrlParser: true, useUnifiedTopology: true },
	);

	await Setting.create({
		key: 'default_channel',
		value: '',
	});

	await Setting.create({
		key: 'log_channels',
		value: {
			bump: {
				id: '',
				webhook: '',
			},
			reputation: {
				id: '',
				webhook: '',
			},
		},
	});

	await Setting.create({
		key: 'reaction_vote',
		value: {
			yes: '👍',
			no: '👎',
		},
	});

	await Setting.create({
		key: 'links',
		value: {
			website: '',
			steamGroup: '',
			instagram: '',
			twitter: '',
			youtube: '',
		},
	});

	await Setting.create({
		key: 'roles',
		value: {
			classes: [
				{ index: 1, id: '', emoji: '' },
				{ index: 2, id: '', emoji: '' },
			],
			ranks: [
				{ index: 1, id: '', emoji: '' },
				{ index: 2, id: '', emoji: '' },
			],
			ping: [
				{ index: 1, id: '', emoji: '' },
				{ index: 2, id: '', emoji: '' },
			],
			games: [
				{ index: 1, id: '', emoji: '' },
				{ index: 2, id: '', emoji: '' },
			],
		},
	});

	await Setting.create({
		key: 'rep_award',
		value: {
			interval: 1,
			award: 3,
			kickback: 1,
			allowBot: true,
		},
	});

	await Setting.create({
		key: 'welcome_messages',
		value: [
			'Welcome message to {USER}',
			'Welcome message to {USER}',
			'Welcome message to {USER}',
		],
	});

	await mongoose.disconnect();
}

console.log('Starting migration...');
migrate();
console.log('Migration completed!');
