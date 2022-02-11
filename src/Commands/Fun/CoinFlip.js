const { MessageEmbed } = require('discord.js');
const Command = require('../../Structures/Command');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['cf'],
			description: 'Flips a coin for heads or tails.',
			category: 'Fun',
		});
	}

	async run(message) {
		const coin = Math.floor(Math.random() * 2) === 0 ? 'Heads' : 'Tails';

		const embed = new MessageEmbed()
			.setColor(this.client.color)
			.setTitle(`It's ${coin}!`)
			.setImage(coin === 'Heads' ? 'https://shaky.i-really-dont-want-to.live/5nx5KGe9J.jpeg' : 'https://shaky.i-really-dont-want-to.live/5nx5AyP34.jpeg')
			.setFooter({ text: this.client.user.username, iconURL: this.client.user.displayAvatarURL() })
			.setTimestamp();

		message.reply({ embeds: [embed] });
	}

};