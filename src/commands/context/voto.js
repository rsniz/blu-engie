const { ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');
const Setting = require('../../models/Setting.js');

module.exports = {
	data: new ContextMenuCommandBuilder()
		.setName('Criar Votação')
		.setType(ApplicationCommandType.Message),

	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });

		const reactions = {
			yes: '👍',
			no: '👎',
		};

		const voteSettings = await Setting.findKey('reaction_vote');
		if (voteSettings) {
			reactions.yes = voteSettings.value.yes;
			reactions.no = voteSettings.value.no;
		}

		const message = interaction.targetMessage;
		await message.react(reactions.yes);
		await message.react(reactions.no);

		await interaction.editReply({ content: 'Votação criada!' });
	},
};
