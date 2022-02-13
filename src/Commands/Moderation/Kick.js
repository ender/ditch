const Command = require('../../Structures/Command');
const { MessageEmbed, Permissions } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Kicks a specified user from the server.',
			category: 'Moderation',
			usage: '<user> [reason]',
		});
	}

	async run(message, [target, ...reason]) {
		if (!message.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) return message.reply('You do not have the required permissions to use this command.');
		if (!message.guild.me.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) return message.reply('I do not have the required permissions to use this command.');

		if (!target) return message.reply('You must specify a user to kick.');

		const toKick = this.client.utils.getMemberStrict(target);
		if (!toKick) return message.reply('Could not find that user.');

		if (toKick.id === message.author.id) return message.reply('You cannot kick yourself.');

		if (!toKick.kickable) return message.reply('I am unable to kick that user.');
		if (!toKick.roles.highest.position >= message.member.roles.highest.position) return message.reply('Your role is not high enough to kick that user.');

		await toKick.kick({ reason: reason.length ? reason.join(' ') : 'No reason provided.' })
			.catch(err => {
				if (err) return message.reply(`I was unable to kick this user due to an error. ${err.message}`);
			});

		const embed = new MessageEmbed()
			.setColor(this.client.color)
			.setThumbnail(toKick.user.displayAvatarURL({ dynamic: true }))
			.setTitle('User Kicked')
			.setDescription('A member of this server has just been kicked.')
			.addField('Member:', `${toKick} (${toKick.id})`, true)
			.addField('Moderator:', `${message.author} (${message.author.id})`, true)
			.addField('Reason:', reason.length ? reason.join(' ') : 'No reason provided.')
			.setFooter({ text: this.client.user.username, iconURL: this.client.user.displayAvatarURL() })
			.setTimestamp();

		message.channel.send({ embeds: [embed] });
	}

};
