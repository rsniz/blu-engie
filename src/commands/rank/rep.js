const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { RepBroker, RepError } = require('../../core/RepBroker.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rep')
		.setDescription('Dá um bônus de reputação para o membro escolhido.')
		.addUserOption(option =>
			option.setName('membro')
				.setDescription('Membro para quem se deseja dar o bônus.')
				.setRequired(true)),

	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });

		try {
			const target = interaction.options.getUser('membro');

			// TODO: Check if recipient has a "No Rep" role.

			await RepBroker.defaultAward({
				giverId: interaction.user.id,
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
