const Command = require('../../Structures/Command');
const { MessageEmbed, Permissions } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['tm'],
			description: 'Times out a specified user.',
			category: 'Moderation',
			usage: '<user> [reason]',
		});
	}

	async run(message, [target, length, ...reason]) {
		if (!message.member.permissions.has(Permissions.FLAGS.MODERATE_MEMBERS)) return message.reply('You do not have the required permissions to use this command.');
		if (!message.guild.me.permissions.has(Permissions.FLAGS.MODERATE_MEMBERS)) return message.reply('I do not have the required permissions to use this command.');

		if (!target) return message.reply('You must specify a user to timeout.');
		if (!length) return message.reply('You must specify a length of time to timeout the user.');

		const toTime = this.client.utils.getMemberStrict(target);
		if (!toTime) return message.reply('Could not find that user.');

		if (toTime.id === message.author.id) return message.reply('You cannot timeout yourself.');

		if (!toTime.moderatable) return message.reply('I am unable to timeout that user.');
		if (!toTime.roles.highest.position >= message.member.roles.highest.position) return message.reply('Your role is not high enough to timeout that user.');

		const duration = new Map([['60s', 60000], ['5m', 300000], ['10m', 600000], ['1h', 3600000], ['1d', 86400000], ['1w', 604800000]]).get(length.trim().toLowerCase());
		if (!duration) return message.reply('You must specify a valid duration. Valid durations are: 60s, 5m, 10m, 1h, 1d, and 1w.');

		await toTime.timeout(duration, { reason: reason.length ? reason.join(' ') : 'No reason provided.' })
			.catch(err => {
				if (err) return message.reply(`I was unable to timeout this user due to an error. ${err.message}`);
			});

		const embed = new MessageEmbed()
			.setColor(this.client.color)
			.setThumbnail(toTime.user.displayAvatarURL({ dynamic: true }))
			.setTitle('User Timeout')
			.setDescription('A member of this server has just been timed out.')
			.addField('Member:', `${toTime} (${toTime.id})`, true)
			.addField('Moderator:', `${message.author} (${message.author.id})`, true)
			.addField('Reason:', reason.length ? reason.join(' ') : 'No reason provided.')
			.setFooter({ text: this.client.user.username, iconURL: this.client.user.displayAvatarURL() })
			.setTimestamp();

		message.channel.send({ embeds: [embed] });
	}

};
