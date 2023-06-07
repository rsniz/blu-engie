const { Events } = require('discord.js');
const { channelId, messages } = require('./welcome.json');

module.exports = {
	name: Events.GuildMemberUpdate,
	async execute(oldMember, newMember) {

		// Check if member has passed the guild's membership gate.
		if (oldMember.pending && !newMember.pending) {
			// Send welcome message.
			try {
				const channel = await newMember.client.channels.fetch(channelId);

				let	reply = messages[(Math.random() * messages.length) | 0];
				reply = reply.replace('{USER}', newMember);
				channel.send(reply);

			}
			catch (error) {
				console.error(error);
			}
		}
	},
};
