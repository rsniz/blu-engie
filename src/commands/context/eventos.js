const { ContextMenuCommandBuilder, ApplicationCommandType, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new ContextMenuCommandBuilder()
		.setName('Criar Evento')
		.setType(ApplicationCommandType.Message)
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageEvents),

	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });

		try {

			const { channelId, guild, targetMessage } = interaction;

			const topic = await guild.channels.fetch(channelId);
			const images = targetMessage.attachments.filter(a => a.contentType.includes('image/'));
			const cover = images.size ? images.first() : null;

			const voiceChannel = guild.channels.cache.filter(c => c.isVoiceBased()).first();

			const nextWeek = new Date();
			nextWeek.setDate(nextWeek.getDate() + 7);

			const event = await guild.scheduledEvents.create({
				name: topic.name,
				scheduledStartTime: nextWeek,
				channel:voiceChannel,
				privacyLevel: 2,
				entityType: 2,
				image: cover ? cover.url : '',
				description: `${topic}`,
			});

			await interaction.editReply({
				embeds: [
					new EmbedBuilder()
						.setTitle('Evento criado!')
						.setThumbnail(cover.url)
						.setDescription(`\n**${topic.name}**
							\nNão esqueça de alterar a **data de início** e o **local** para os valores apropriados.
							\n[Link do Evento](${event.url})`)
						.setColor(0x0CC90E)
						.setTimestamp(),
				],
			});
		}

		catch (error) {
			console.error(error);
			await interaction.editReply({
				embeds: [
					new EmbedBuilder()
						.setDescription('Um erro ocorreu ao tentar criar o evento.')
						.setColor(0xF20D0D),
				],
				ephemeral: true,
			});
		}
	},
};
