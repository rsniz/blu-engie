const mongo = require('mongoose');

const Schema = new mongo.Schema({
	id: String,
	reputation: { type: Number, default: 0 },
	bumps: { type: Number, default: 0 },
});

Schema.statics.findOrCreate = async function(id) {
	let member = await this.findOne({ id: id });
	if (!member) {
		member = await this.create({
			id: id,
		});
	}
	return member;
};

module.exports = mongo.model('Member', Schema);
