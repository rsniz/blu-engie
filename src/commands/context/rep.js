const { ContextMenuCommandBuilder, ApplicationCommandType, EmbedBuilder } = require('discord.js');
const { RepBroker, RepError } = require('../../core/RepBroker.js');

module.exports = {
	data: new ContextMenuCommandBuilder()
		.setName('Dar Reputação')
		.setType(ApplicationCommandType.User),

	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });

		try {
			const target = interaction.targetUser;

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
