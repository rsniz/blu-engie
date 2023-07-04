const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
	key: { type: String, required: true },
	value: { type: mongoose.Schema.Types.Mixed },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

Schema.statics.findKey = async function(key) {
	return await this.findOne({ key: key });
};

const Setting = mongoose.model('Setting', Schema);

module.exports = Setting;
