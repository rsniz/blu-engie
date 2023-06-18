const { EmbedBuilder, Events } = require('discord.js');
const { channelId, messages } = require('../config/welcome.json');
const { ranks } = require('../config/roles.json');

module.exports = {
	name: Events.GuildMemberUpdate,
	async execute(oldMember, newMember) {
		try {
			// Check if member has passed the guild's membership gate.
			if (oldMember.pending && !newMember.pending) {
				// Send welcome message.
				const channel = await newMember.client.channels.fetch(channelId);

				const reply = messages[(Math.random() * messages.length) | 0];
				channel.send(reply.replace('{USER}', newMember));

			}
			// Check if roles have changed
			else if (!oldMember.roles.cache.equals(newMember.roles.cache)) {
				const rankIds = ranks.filter(r => r.index > 1).map(r => r.id);
				const newRoles = newMember.roles.cache.subtract(oldMember.roles.cache);
				const newRanks = newRoles.filter(r => rankIds.includes(r.id));

				if (newRanks.size > 0) {
					// Get the highest rank.
					const newRank = newRanks.sort((rA, rB) => {
						rB.rawPosition - rA.rawPosition;
					}).first();

					const channel = await newMember.client.channels.fetch(channelId);
					const embed = new EmbedBuilder()
						.setColor(0x0cc90e)
						.setDescription(`:tada:  ${newMember} acabou de subir para o rank ${newRank}  :tada:`)
						.setTimestamp();

					channel.send({ embeds: [embed] });
				}
			}
		}
		catch (error) {
			console.error(error);
		}
	},
};
