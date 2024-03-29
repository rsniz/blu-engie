const { EmbedBuilder, Events } = require('discord.js');
const Setting = require('../models/Setting.js');

module.exports = {
	name: Events.GuildMemberUpdate,
	async execute(oldMember, newMember) {
		try {
			// Check if member has passed the guild's membership gate.
			if (oldMember.pending && !newMember.pending) {
				// Send welcome message.
				const { value: defaultChannel } = await Setting.findKey('default_channel');
				const channel = await newMember.client.channels.fetch(defaultChannel);

				const { value: messages } = await Setting.findKey('welcome_messages');
				const reply = messages[(Math.random() * messages.length) | 0];
				channel.send(reply.replace('{USER}', newMember));

			}
			// Check if roles have changed
			else if (!oldMember.roles.cache.equals(newMember.roles.cache)) {
				const newRoles = newMember.roles.cache.subtract(oldMember.roles.cache);

				// Check for new ranks
				const { value: { ranks } } = await Setting.findKey('roles');
				const rankIds = ranks.filter(r => r.index > 0).map(r => r.id);
				const newRanks = newRoles.filter(r => rankIds.includes(r.id));

				if (newRanks.size > 0) {
					// Get the highest rank.
					const newRank = newRanks.sort((rA, rB) => {
						rB.rawPosition - rA.rawPosition;
					}).first();

					const { value: defaultChannel } = await Setting.findKey('default_channel');
					const channel = await newMember.client.channels.fetch(defaultChannel);
					const embed = new EmbedBuilder()
						.setColor(0x0cc90e)
						.setTitle('Atualização de Rank!')
						.setThumbnail(newMember.displayAvatarURL())
						.setDescription(`${newMember} acabou de subir para o rank ${newRank}!\n\n:tada: Parabéns :tada:`)
						.setFooter({ text: `Membros neste Rank: ${newRank.members.size}` })
						.setTimestamp();

					channel.send({ embeds: [embed] });
				}

				// Check for VIP roles
				const { value: { vip } } = await Setting.findKey('roles');

				const vipIds = vip.filter(r => r.index > 0).map(r => r.id);
				const newVips = newRoles.filter(r => vipIds.includes(r.id));

				if (newVips.size > 0) {
					// Get the highest vip.
					const newVip = newVips.sort((rA, rB) => {
						rB.rawPosition - rA.rawPosition;
					}).first();

					const { value: defaultChannel } = await Setting.findKey('default_channel');
					const channel = await newMember.client.channels.fetch(defaultChannel);
					const embed = new EmbedBuilder()
						.setColor(0xf47fff)
						.setTitle('Apoio VIP!')
						.setThumbnail(newMember.displayAvatarURL())
						.setDescription(`${newMember} agora é ${newVip}!\n\nAgradecemos por sua contribuição à nossa Comunidade! :purple_heart:`)
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
