const Command = require('../../Structures/Command');
const canvacord = require('canvacord');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['rank'],
			description: 'Displays a user\'s level and experience.',
			category: 'Information',
			usage: '[user]',
		});
	}

	async run(message, [target]) {
		const toCheck = this.client.utils.getMember(message, target);

		const entry = this.client.utils.getUser(toCheck.id);
		if (!entry) return message.reply(`${toCheck} has not yet spoken in this server.`);

		const data = await new canvacord.Rank()
			.setAvatar(toCheck.user.displayAvatarURL({ format: 'png' }))
			.setBackground('COLOR', this.client.color)
			.setLevel(entry.level)
			.setCurrentXP(entry.experience)
			.setRequiredXP(Math.ceil(Math.pow((entry.level + 1) / 0.1211, 2)))
			.setStatus(toCheck.presence ? toCheck.presence.status : 'offline')
			.setProgressBar('#000000', 'COLOR')
			.setUsername(toCheck.user.username)
			.setDiscriminator(toCheck.user.discriminator).build();

		message.reply({ files: [data] });
	}

};