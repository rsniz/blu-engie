const { EmbedBuilder, Events } = require('discord.js');
const Setting = require('../models/Setting.js');
const Member = require('../models/Member.js');

module.exports = {
	name: Events.GuildMemberAdd,
	async execute(member) {
		try {
			// Update member on DB.
			await Member.findOrCreate(member.id);

			const logEmbed = new EmbedBuilder()
				.setColor(0x0cc90e)
				.setTitle('Novo Usuário')
				.setThumbnail(member.displayAvatarURL())
				.setDescription(`${member} acabou de entrar.`)
				.setFields(
					{
						name: 'Informações da Conta',
						value: `Criado em ${member.user.createdAt}`,
					})
				.setTimestamp();

			const { value: { memberJoin } } = await Setting.findKey('log_channels');
			const channel = await member.client.channels.fetch(memberJoin.id);
			channel.send({ embeds: [ logEmbed ] });

		}
		catch (error) {
			console.error(error);
		}
	},
};
