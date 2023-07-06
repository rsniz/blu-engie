// Simple script to migrate old configs to database.

const mongoose = require('mongoose');
mongoose.connect(
	process.env.MONGODB_URL,
	{ useNewUrlParser: true, useUnifiedTopology: true },
).then(console.log('Connected to Mongodb.'));

const Setting = require('./models/Setting.js');
const welcome = require('./config/welcome.json');
const roles = require('./config/roles.json');

migrate();

async function migrate() {
	const defaultChannel = new Setting({
		key: 'default_channel',
		value: welcome.channelId,
	});
	defaultChannel.save();

	const welcomeMessages = new Setting({
		key: 'welcome_messages',
		value: welcome.messages,
	});
	welcomeMessages.save();

	const rolesSetting = new Setting({
		key: 'roles',
		value: roles,
	});
	rolesSetting.save();

	const intervalSetting = await Setting.findKey('rep_award_interval');
	const repAward = new Setting({
		key: 'rep_award',
		value: {
			interval: intervalSetting.value,
			award: 3,
			kickback: 1,
			allowBot: false,
		},
	});
	repAward.save();

	await Setting.deleteOne({ _id: intervalSetting._id });
}
