const mongo = require('mongoose');

const Schema = new mongo.Schema({
	id: String,
	reputation: Number,
});

Schema.statics.findOrCreate = async function(id) {
	const member = await this.findOneAndUpdate(
		{ id: id },
		{
			id: id,
			reputation: 0,
		},
		{
			upsert: true,
			new: true,
		});
	return member;
};

module.exports = mongo.model('Member', Schema);
