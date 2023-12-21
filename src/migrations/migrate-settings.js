// Creates basic Settings for database testing.

const fs = require('node:fs');
const mongoose = require('mongoose');
const Setting = require ('../models/Setting.js');

require('dotenv').config();
const mongodbURL = fs.readFileSync(process.env.MONGODB_URL_FILE, 'utf-8').trim();

async function migrate() {

	await mongoose.connect(
		mongodbURL,
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
			memberJoin: {
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
		key: 'servers',
		value: {
			cmb: {
				name: 'Custom Maps - Brasil',
				ips: [
					{ index: 0, description: '', ip: '' },
					{ index: 1, description: '', ip: '' },
				],
			},
			uncletopiaSp: {
				name: 'Uncletopia - São Paulo',
				ips: [
					{ index: 0, description: '', ip: '' },
					{ index: 1, description: '', ip: '' },
				],
			},
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
			vip: [
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
