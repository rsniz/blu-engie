const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { classes, ranks } = require('../../config/roles.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('membros')
		.setDescription('Lista quantidade de membros em cargos.')
		.addSubcommand(subcommand =>
			subcommand
				.setName('classes')
				.setDescription('Membros dos cargos de classe.')
				.addBooleanOption(option =>
					option.setName('público')
						.setDescription('Exibe a resposta para todos. Por padrão só você pode ver.')))
		.addSubcommand(subcommand =>
			subcommand
				.setName('ranks')
				.setDescription('Membros dos ranks de experiência.')
				.addBooleanOption(option =>
					option.setName('público')
						.setDescription('Exibe a resposta para todos. Por padrão só você pode ver.'))),

	async execute(interaction) {
		const ephemeral = !interaction.options.getBoolean('público');

		await interaction.deferReply({ ephemeral: ephemeral });

		if (interaction.options.getSubcommand() === 'classes') {
			const roles = await fetchRoles(classes, interaction.guild);
			await interaction.editReply({ embeds: [buildEmbed('Membros por Classe', roles)] });
		}
		else if (interaction.options.getSubcommand() === 'ranks') {
			const roles = await fetchRoles(ranks, interaction.guild);
			await interaction.editReply({ embeds: [buildEmbed('Membros por Rank', roles)] });
		}
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
