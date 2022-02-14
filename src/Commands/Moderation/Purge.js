const Command = require('../../Structures/Command');
const { Permissions } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Delete a number of messages, optionally within a specified scope.',
			category: 'Moderation',
			usage: '<amount> [user | phrase]',
		});
	}

	async run(message, [amount, ...scope]) {
		if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return message.reply('You do not have the required permissions to use this command.');
		if (!message.guild.me.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return message.reply('I do not have the required permissions to use this command.');

		if (!amount || isNaN(parseInt(amount))) return message.reply('You must specify a number of messages to delete.');
		amount = parseInt(amount);

		if (amount < 5) return message.reply('You must delete at least 5 messages.');

		if (!scope.length) {
			if (message.deletable) await message.delete();

			const { size } = await message.channel.bulkDelete(amount, true);
			return message.channel.send(`Deleted ${size} messages.`);
		}

		const messages = (await message.channel.messages.fetch()).filter(m => m.id !== message.id);
		console.log(messages.size);
		const user = this.client.utils.getMemberStrict(message, scope[0]);

		let toDelete = messages.filter(m => m.content.toLowerCase().trim().includes(scope.join(' ').toLowerCase().trim())).first(amount);

		if (user) {
			toDelete = messages.filter(m => m.author.id === user.id).first(amount);
			if (scope.length > 1) toDelete = messages.filter(m => m.author.id === user.id && m.content.toLowerCase().trim().includes(scope.slice(1).join(' ').toLowerCase().trim())).first(amount);
		}

		if (toDelete.size === 0) return message.reply('I could not find any messages matching your specifications.');

		if (message.deletable) await message.delete();

		const { size } = await message.channel.bulkDelete(toDelete, true);
		message.channel.send(`Deleted ${size} messages.`);
	}

};
