const Command = require('../../Structures/Command');
const { MessageEmbed, Permissions } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Unbans a specified user from the server.',
			category: 'Moderation',
			usage: '<user> [reason]',
		});
	}

	async run(message, [target, ...reason]) {
		if (!message.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) return message.reply('You do not have the required permissions to use this command.');
		if (!message.guild.me.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) return message.reply('I do not have the required permissions to use this command.');

		if (!target) return message.reply('You must specify a user to unban.');

		const bans = await message.guild.bans.fetch();
		const toUnban = bans.get(target) || bans.find(ban => ban.user.tag.toLowerCase().includes(target));

		if (!toUnban) return message.reply('That user is not banned from the server.');

		if (toUnban.id === message.author.id) return message.reply('You cannot unban yourself.');

		await message.guild.members.unban(toUnban.user, { reason: reason.length ? reason.join(' ') : 'No reason provided.' })
			.catch(err => {
				if (err) return message.reply(`I was unable to unban this user due to an error. ${err.message}`);
			});

		const embed = new MessageEmbed()
			.setColor(this.client.color)
			.setThumbnail(toUnban.user.displayAvatarURL({ dynamic: true }))
			.setTitle('User Unbanned')
			.setDescription('A member of this server has just been unbanned.')
			.addField('Member:', `${toUnban.user} (${toUnban.user.id})`, true)
			.addField('Moderator:', `${message.author} (${message.author.id})`, true)
			.addField('Reason:', reason.length ? reason.join(' ') : 'No reason provided.')
			.setFooter({ text: this.client.user.username, iconURL: this.client.user.displayAvatarURL() })
			.setTimestamp();

		message.channel.send({ embeds: [embed] });
	}

};