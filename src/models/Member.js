const mongo = require('mongoose');

const Schema = new mongo.Schema({
	id: String,
	reputation: Number,
});

Schema.statics.findOrCreate = async function(id) {
	return await this.findOneAndUpdate(
		{ id: id },
		{
			id: id,
			reputation: 0,
		},
		{
			upsert: true,
			new: true,
		});
};

module.exports = mongo.model('Member', Schema);
