const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const Member = require('../../models/Member.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('top')
		.setDescription('Exibe a classificação dos membros do servidor.')
		.addBooleanOption(option =>
			option.setName('visível')
				.setDescription('Exibe a resposta no chat. Por padrão só você pode ver.')),

	async execute(interaction) {
		const ephemeral = !interaction.options.getBoolean('visível');

		await interaction.deferReply({ ephemeral: ephemeral });

		try {
			const members = await Member.find({}).sort({ reputation: -1 });

			let rank = await Promise.all(members.map(async member => {
				const guildMember = await interaction.guild.members.fetch(member.id);
				return {
					guildMember: guildMember,
					id: member.id,
					reputation: member.reputation,
				};
			}));

			// TODO: Filter out members that have left the Discord guild.
			rank = rank.filter(m => m.guildMember);

			const scoreboard = new EmbedBuilder()
				.setTitle('Classificação de Reputação')
				.setColor(0x0CC90E)
				.setFooter({ text: `Total: ${rank.length}` })
				.setTimestamp();

			let desc = '\n';

			// TODO: Add pagination to scoreboard
			const page1 = rank.slice(0, 24);

			page1.forEach((m, i) => {
				desc += `**#${i + 1}** ${m.guildMember}\nRep: ${m.reputation} (+${m.reputation * 50} exp)\n`;
			});

			scoreboard.setDescription(desc);

			await interaction.editReply({
				embeds: [ scoreboard ],
				ephemeral: ephemeral },
			);
		}
		catch (error) {
			console.error(error);
		}
	},
};
