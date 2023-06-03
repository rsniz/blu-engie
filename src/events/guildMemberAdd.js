const { Events } = require('discord.js');
const { channelId, messages } = require('./welcome.json');

module.exports = {
	name: Events.GuildMemberAdd,
	async execute(member) {

		try {
			const channel = await member.client.channels.fetch(channelId);

			let	reply = messages[(Math.random() * messages.length) | 0];
			reply = reply.replace('{USER}', member);
			channel.send(reply);

		}
		catch (error) {
			console.error(error);
		}
	},
};
