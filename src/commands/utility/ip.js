const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const Setting = require('../../models/Setting.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ip')
		.setDescription('Exibe IPs de servidores da comunidade.')
		.addStringOption(option =>
			option.setName('servidor')
				.setDescription('Servidor a ser exibido.')
				.setRequired(true)
				.addChoices(
					{ name: 'Custom Maps - Brasil', value: 'cmb' },
					{ name: 'Uncletopia - São Paulo', value: 'uncletopiaSp' },
				))
		.addBooleanOption(option =>
			option.setName('público')
				.setDescription('Exibe a resposta para todos os membros. Por padrão só você pode ver.')),

	async execute(interaction) {
		const ephemeral = !interaction.options.getBoolean('público');
		await interaction.deferReply({ ephemeral: ephemeral });

		const choice = interaction.options.getString('servidor');
		const { value: servers } = await Setting.findKey('servers');
		const server = servers[choice];

		const fields = server.ips.map(ip => {
			return {
				name: ip.description,
				value: `\`\`connect ${ip.ip}\`\`\n[Conectar](https://tf2maniacos.com.br/connect.php?ip=${ip.ip})`,
			};
		});

		const serverEmbed = new EmbedBuilder()
			.setTitle(server.name)
			.setColor(0x0cc90e)
			.addFields(fields);


		if (!server) {
			await interaction.editReply({ content: `Servidor *${server}* não pôde ser encontrado.` });
		}
		else {
			await interaction.editReply({ embeds: [ serverEmbed ] });
		}
	},
};
