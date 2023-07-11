const mongo = require('mongoose');

const Schema = new mongo.Schema({
	code: { type: String, required: true },
	inviterId: { type: String, required: true },
	uses: { type: Number, default: 0 },
	description: { type: String, default: '' },
});

Schema.statics.findOrCreate = async function(code, inviterId) {
	let invite = await this.findOne({ code: code, inviterId: inviterId });
	if (!invite) {
		invite = await this.create({
			code: code,
			inviterId: inviterId,
		});
	}
	return invite;
};

module.exports = mongo.model('Invite', Schema);
