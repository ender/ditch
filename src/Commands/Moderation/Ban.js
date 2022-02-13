const Command = require('../../Structures/Command');
const { MessageEmbed, Permissions } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Bans a specified user from the server.',
			category: 'Moderation',
			usage: '<user> [reason]',
		});
	}

	async run(message, [target, ...reason]) {
		if (!message.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) return message.reply('You do not have the required permissions to use this command.');
		if (!message.guild.me.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) return message.reply('I do not have the required permissions to use this command.');

		if (!target) return message.reply('You must specify a user to ban.');

		const toBan = this.client.utils.getMemberStrict(target);
		if (!toBan) return message.reply('Could not find that user.');

		if (toBan.id === message.author.id) return message.reply('You cannot ban yourself.');

		if (!toBan.bannable) return message.reply('I am unable to ban that user.');
		if (!toBan.roles.highest.position >= message.member.roles.highest.position) return message.reply('Your role is not high enough to ban that user.');

		await toBan.ban({ reason: reason.length ? reason.join(' ') : 'No reason provided.' })
			.catch(err => {
				if (err) return message.reply(`I was unable to ban this user due to an error. ${err.message}`);
			});

		const embed = new MessageEmbed()
			.setColor(this.client.color)
			.setThumbnail(toBan.user.displayAvatarURL({ dynamic: true }))
			.setTitle('User Banned')
			.setDescription('A member of this server has just been permanently banned.')
			.addField('Member:', `${toBan} (${toBan.id})`, true)
			.addField('Moderator:', `${message.author} (${message.author.id})`, true)
			.addField('Reason:', reason.length ? reason.join(' ') : 'No reason provided.')
			.setFooter({ text: this.client.user.username, iconURL: this.client.user.displayAvatarURL() })
			.setTimestamp();

		message.channel.send({ embeds: [embed] });
	}

};
