const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { RepBroker, RepError } = require('../../core/RepBroker.js');
const Setting = require('../../models/Setting.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rep')
		.setDescription('Dá um bônus de reputação para o membro escolhido.')
		.addUserOption(option =>
			option.setName('membro')
				.setDescription('Membro que receberá o bônus de reputação.')
				.setRequired(true)),

	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });

		try {
			const target = interaction.options.getUser('membro');
			const user = interaction.user;

			// TODO: Check if recipient has a "No Rep" role.

			await RepBroker.defaultAward({
				giverId: user.id,
				recipientId: target.id,
				isBot: target.bot,
			});
			await interaction.editReply({
				embeds: [
					new EmbedBuilder()
						.setDescription(`Bônus de reputação dado para ${target}!`)
						.setColor(0x0CC90E),
				],
				ephemeral: true,
			});

			const { value: { reputation } } = await Setting.findKey('log_channels');
			const logChannel = await interaction.guild.channels.fetch(reputation.id);

			logChannel.send({
				embeds: [
					new EmbedBuilder()
						.setDescription(`${user} deu reputação para ${target}!`)
						.setColor(0x0CC90E)
						.setTimestamp(),
				],
			});
		}

		catch (error) {
			if (error instanceof RepError) {
				await interaction.editReply({
					embeds: [
						new EmbedBuilder()
							.setDescription(error.message)
							.setColor(0xF20D0D),
					],
					ephemeral: true,
				});
			}
		}
	},
};
