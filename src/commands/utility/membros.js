const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const Setting = require('../../models/Setting.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('membros')
		.setDescription('Lista quantidade de membros em cargos.')
		.addStringOption(option =>
			option.setName('categoria')
				.setDescription('Categoria de cargos.')
				.setRequired(true)
				.addChoices(
					{ name: 'Classes', value: 'classes' },
					{ name: 'Ranks', value: 'ranks' },
					{ name: 'Notificação', value: 'ping' },
					{ name: 'Jogos', value: 'games' },
				))
		.addBooleanOption(option =>
			option.setName('visível')
				.setDescription('Exibe a resposta no chat. Por padrão só você pode ver.')),

	async execute(interaction) {
		const ephemeral = !interaction.options.getBoolean('visível');
		await interaction.deferReply({ ephemeral: ephemeral });

		const category = interaction.options.getString('categoria');
		const titles = {
			classes: 'Membros por Classes',
			ranks: 'Membros por Rank',
			ping: 'Membros pro Notificações',
			games: 'Memros por Jogos',
		};

		if (!Object.keys(titles).includes(category)) {
			await interaction.editReply({ content: `Opção *${category}* não reconhecida.` });
			return;
		}

		const { value: rolesList } = await Setting.findKey('roles');
		const roles = await fetchRoles(rolesList[category], interaction.guild);
		await interaction.editReply({ embeds: [buildEmbed(titles[category], roles)] });

	},
};

function buildEmbed(title, roles) {
	const total = roles.reduce((acc, r) => acc + r.members, 0);

	let description = '';
	roles.forEach(r => {
		description += `${r.emoji} ${r.role.toString()} **${r.members}** `;
		description += `(${percent(r.members, total)}%)\n`;
	});

	return new EmbedBuilder()
		.setColor(0x0CC90E)
		.setTitle(title)
		.setDescription(description)
		.setTimestamp()
		.setFooter({ text: `Total: ${total}` });

}

async function fetchRoles(roleList, guild) {
	return await Promise.all(roleList.map(async e => {
		e.role = await guild.roles.fetch(e.id);
		e.members = e.role.members.size;
		return e;
	}));
}

function percent(value, total) {
	return ((value / total) * 100).toFixed(2);
}
