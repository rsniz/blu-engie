const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
	inviterId: {
		type: String,
		required: true,
	},
	userId: {
		type: String,
		required: true,
	},
	code: {
		type: String,
		required: true,
	},
	timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('InviteUse', Schema);
