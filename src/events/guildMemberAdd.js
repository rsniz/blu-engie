const { EmbedBuilder, Events } = require('discord.js');
const Setting = require('../models/Setting.js');
const Member = require('../models/Member.js');
const Invite = require('../models/Invite.js');
const InviteUse = require('../models/InviteUse.js');

module.exports = {
	name: Events.GuildMemberAdd,
	async execute(member) {
		try {
			// Check for used invites
			const activeInvites = await member.guild.invites.fetch();
			let changedInvites = await Promise.all(activeInvites.map(async i => {
				const invite = await Invite.findOrCreate(i.code, i.inviterId);
				i.oldUses = invite.uses;
				return i;
			}));

			changedInvites = changedInvites.filter(i => i.uses > i.oldUses);
			if (changedInvites.size > 1) console.error('ALERT: Too many invites used at once.');

			// Pick used invite
			const usedInvite = changedInvites[0];

			// Update invite on DB.
			const storedInvite = await Invite.findOne({ code: usedInvite.code });
			storedInvite.uses = usedInvite.uses;
			storedInvite.save();

			// Log invite use.
			await InviteUse.create({
				inviterId: usedInvite.inviterId,
				userId: member.id,
				code: usedInvite.code,
			});

			// Update member on DB.
			await Member.findOrCreate(member.id);

			const inviter = await member.guild.members.fetch(usedInvite.inviterId);

			const logEmbed = new EmbedBuilder()
				.setColor(0x0cc90e)
				.setTitle('Novo Usuário')
				.setThumbnail(member.displayAvatarURL())
				.setDescription(`${member} acabou de entrar.`)
				.setFields(
					{
						name: 'Convite',
						value: `${usedInvite.code} - Criado por ${inviter}\n${usedInvite.uses} usos.`
						+ (storedInvite.description ? `\n${storedInvite.description}` : ''),
					},
					{
						name: 'Informações da Conta',
						value: `Criado em ${member.user.createdAt}`,
					})
				.setTimestamp();

			const { value: { memberJoin } } = await Setting.findKey('log_channels');
			const channel = await member.client.channels.fetch(memberJoin.id);
			channel.send({ embeds: [ logEmbed ] });

		}
		catch (error) {
			console.error(error);
		}
	},
};
