const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('sorteio')
		.setDescription('Realiza um sorteio entre os mebros do cargo especificado.')
		.addRoleOption(option =>
			option.setName('cargo')
				.setDescription('Cargo dos membros para quem se deseja realizar o sorteio.')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('descrição')
				.setDescription('Descrição do sorteio.'))
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

	async execute(interaction) {
		await interaction.deferReply();

		const description = interaction.options.getString('descrição');
		const { members } = interaction.options.getRole('cargo');
		const winner = members.random();

		let reply = description ? `${description}\n\n` : '';
		reply += `:tada: ${winner} ganhou o sorteio! :tada:`;

		const embed = new EmbedBuilder()
			.setColor(0x0cc90e)
			.setTitle('Resultado do Sorteio')
			.setThumbnail(winner.displayAvatarURL())
			.setDescription(reply)
			.setFooter({ text: `Participantes: ${members.size}` })
			.setTimestamp();

		await interaction.editReply({ embeds: [ embed ] });
	},
};
