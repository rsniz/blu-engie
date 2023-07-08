const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { RepBroker, RepError } = require('../../core/RepBroker.js');
const Setting = require('../../models/Setting.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rep-extra')
		.setDescription('Dá um bônus extraordinário de reputação para o membro escolhido.')
		.addUserOption(option =>
			option.setName('membro')
				.setDescription('Membro para quem se deseja dar o bônus de reputação.')
				.setRequired(true))
		.addNumberOption(option =>
			option.setName('reputação')
				.setDescription('Quantidade de reputação a ser dada.')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('motivo')
				.setDescription('Motivo do bônus de reputação.')
				.setRequired(true))
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });

		try {
			const target = interaction.options.getUser('membro');
			const reason = interaction.options.getString('motivo');
			const amount = interaction.options.getNumber('reputação');
			const user = interaction.user;

			await RepBroker.giveRep({
				giverId: user.id,
				recipientId: target.id,
				amount: amount,
				reason: reason,
				type: 1,
			});
			await interaction.editReply({
				embeds: [
					new EmbedBuilder()
						.setDescription(`Bônus de reputação dado para ${target}!`)
						.setColor(0x0CC90E),
				],
				ephemeral: true,
			});

			const logMessage = `${user} deu **${amount}** de reputação para ${target}!\n\n**Motivo:**\n${reason}`;
			const logEmbed = new EmbedBuilder()
				.setDescription(logMessage)
				.setColor(0x0CC90E)
				.setTimestamp();

			const { value: { repAward } } = await Setting.findKey('log_channels');
			const logChannel = await interaction.guild.channels.fetch(repAward.id);

			const { value: defaultChannel } = await Setting.findKey('default_channel');
			const defChannel = await interaction.guild.channels.fetch(defaultChannel);

			logChannel.send({ embeds: [ logEmbed ] });
			defChannel.send({ embeds: [ logEmbed ] });
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
