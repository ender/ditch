const Command = require('../../Structures/Command');
const { MessageEmbed, Permissions } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['unt'],
			description: 'Takes a specified user out of timeout.',
			category: 'Moderation',
			usage: '<user> [reason]',
		});
	}

	async run(message, [target, ...reason]) {
		if (!message.member.permissions.has(Permissions.FLAGS.MODERATE_MEMBERS)) return message.reply('You do not have the required permissions to use this command.');
		if (!message.guild.me.permissions.has(Permissions.FLAGS.MODERATE_MEMBERS)) return message.reply('I do not have the required permissions to use this command.');

		if (!target) return message.reply('You must specify a user to take out of timeout.');

		const toUntime = this.client.utils.getMemberStrict(message, target);
		if (!toUntime) return message.reply('Could not find that user.');

		if (!toUntime.isCommunicationDisabled()) return message.reply('That user is not currently in timeout.');

		if (!toUntime.moderatable) return message.reply('I am unable to take that user out of timeout.');
		if (!toUntime.roles.highest.position >= message.member.roles.highest.position) return message.reply('Your role is not high enough to take that user out of timeout.');

		await toUntime.timeout(null, { reason: reason.length ? reason.join(' ') : 'No reason provided.' })
			.catch(err => {
				if (err) return message.reply(`I was unable to take this user out of timeout due to an error. ${err.message}`);
			});

		const embed = new MessageEmbed()
			.setColor(this.client.color)
			.setThumbnail(toUntime.user.displayAvatarURL({ dynamic: true }))
			.setTitle('User Removed from Timeout')
			.setDescription('A member of this server has just been removed from timeout.')
			.addField('Member:', `${toUntime} (${toUntime.id})`, true)
			.addField('Moderator:', `${message.author} (${message.author.id})`, true)
			.addField('Reason:', reason.length ? reason.join(' ') : 'No reason provided.')
			.setFooter({ text: this.client.user.username, iconURL: this.client.user.displayAvatarURL() })
			.setTimestamp();

		message.channel.send({ embeds: [embed] });
	}

};
