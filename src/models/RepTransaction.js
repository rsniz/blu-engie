const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
	recipientId: {
		type: String,
		required: true,
	},
	giverId: {
		type: String,
		required: true,
	},
	type: {
		type: Number,
		// 0 - Default; 1- Extra; 2 - Bump
		enum: [0, 1, 2],
		default: 0,
	},
	amount: { type: Number, required: true },
	reason: { type: String },
	timestamp: { type: Date, default: Date.now },
});

Schema.statics.latestDefault = async function(id) {
	return await this.findOne({ giverId: id, type: 0 })
		.sort({ timestamp: -1 });
};

const RepTransaction = mongoose.model('RepTransaction', Schema);

module.exports = RepTransaction;
