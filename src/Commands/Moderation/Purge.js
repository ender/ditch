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

			const { size } = await message.channel.bulkDelete(amount, true).catch(() => {
				const toDelete = message.channel.messages.fetch({ limit: amount });
				toDelete.forEach(async msg => await msg.delete());

				return message.channel.send(`Deleted ${toDelete.size} messages.`);
			});
			return message.channel.send(`Deleted ${size} messages.`);
		}

		const user = this.client.utils.getMemberStrict(message, scope[0]);

		let toDelete;
		if (user && scope.length > 1) {
			toDelete = message.channel.messages.cache.filter(m => m.author.id === user.id && m.content.toLowerCase().trim().includes(scope.slice(1).join(' ').toLowerCase().trim())
                && m.id !== message.id);
		}
		else if (user) {
			toDelete = message.channel.messages.cache.filter(m => m.author.id === user.id && m.id !== message.id);
		}
		else {
			toDelete = message.channel.messages.cache.filter(m => m.content.toLowerCase().trim().includes(scope.join(' ').toLowerCase().trim()) && m.id !== message.id);
		}

		if (toDelete.size === 0) return message.reply('I could not find any messages matching your specifications.');

		if (message.deletable) await message.delete();

		const { size } = await message.channel.bulkDelete(toDelete.first(amount), true);
		message.channel.send(`Deleted ${size} messages.`);
	}

};
