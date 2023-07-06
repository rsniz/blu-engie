const { SlashCommandBuilder } = require('discord.js');
const Setting = require('../../models/Setting.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('link')
		.setDescription('Exibe links úteis da comunidade.')
		.addStringOption(option =>
			option.setName('link')
				.setDescription('Link para exibir')
				.setRequired(true)
				.addChoices(
					{ name: 'Grupo da Steam', value: 'steamGroup' },
					{ name: 'Website', value: 'website' },
				))
		.addBooleanOption(option =>
			option.setName('público')
				.setDescription('Exibe a resposta para todos os membros. Por padrão só você pode ver.')),

	async execute(interaction) {
		const ephemeral = !interaction.options.getBoolean('público');
		await interaction.deferReply({ ephemeral: ephemeral });

		const choice = interaction.options.getString('link');
		const { value: links } = await Setting.findKey('links');
		const link = links[choice];

		if (!link) {
			await interaction.editReply({ content: `Link *${choice}* não pôde ser encontrado.` });
		}
		else {
			await interaction.editReply({ content: link });
		}
	},
};
