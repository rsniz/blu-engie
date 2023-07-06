const { EmbedBuilder, Events } = require('discord.js');
const Setting = require('../models/Setting.js');
const Member = require('../models/Member.js');

// Message Type
const ChatInputCommand = 20;

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
		if (message.type !== ChatInputCommand) return;

		const name = message.interaction.commandName;
		if (name !== 'bump') return;

		const user = message.interaction.user;

		const member = await Member.findOrCreate(user.id);
		if (typeof member.bumps === 'number') {
			member.bumps += 1;
		}
		else {
			member.bumps = 1;
		}
		member.save();
		await message.react('🌟');

		const { value: { bump } } = await Setting.findKey('log_channels');
		const logChannel = await message.guild.channels.fetch(bump.id);

		logChannel.send({
			embeds: [
				new EmbedBuilder()
					.setDescription(`${user} deu bump no servidor!`)
					.setColor(0x24B7B7)
					.setTimestamp(),
			],
		});
	},
};
