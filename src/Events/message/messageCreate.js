const Event = require('../../Structures/Event');

module.exports = class extends Event {

	async run(message) {
		const mentionRegex = RegExp(`^<@!${this.client.user.id}>$`);
		const mentionRegexPrefix = RegExp(`^<@!${this.client.user.id}> `);

		if (!message.guild || message.author.bot) return;

		let user = this.client.utils.getUser(message.author.id);
		if (!user) user = { id: message.author.id, experience: this.client.utils.randInt(10, 30), level: 0, lastExperience: message.createdTimestamp };

		const timeSince = message.createdTimestamp - user.lastExperience;
		if (timeSince >= this.client.cooldown) {
			user.experience = user.experience + this.client.utils.randInt(10, 30);
			user.lastExperience = message.createdTimestamp;
		}

		const level = Math.floor(0.1211 * Math.sqrt(user.experience));
		if (level > user.level) {
			user.level = level;

			if (level % 10 === 0) {
				const oldLevelRole = message.guild.roles.cache.find(role => role.name === `Level ${level - 10}`);
				if (oldLevelRole && message.member.roles.cache.has(oldLevelRole.id)) await message.member.roles.remove(oldLevelRole);
				const newlevelRole = this.client.utils.getRole(message.guild, `Level ${level}`);
				await message.member.roles.add(newlevelRole);
				message.reply(`Congratulations! You've leveled up to level **${level}**! You have been granted the ${newlevelRole} role!`);
			}
			else {
				message.reply(`Congratulations! You've leveled up to level **${level}**!`);
			}
		}

		this.client.utils.setUser(user);

		if (message.content.match(mentionRegex)) message.reply(`To invoke my commands in this server please use the prefix \`${this.client.prefix}\`.`);

		const prefix = message.content.match(mentionRegexPrefix) ? message.content.match(mentionRegexPrefix)[0] : this.client.prefix;

		if (!message.content.startsWith(prefix)) return;
		if (message.content.startsWith(message.content.match(mentionRegexPrefix)[0])) message.mentions.members.delete(message.mentions.members.first());

		const [cmd, ...args] = message.content.slice(prefix.length).trim().split(/ +/g);

		const command = this.client.commands.get(cmd) || this.client.commands.get(this.client.aliases.get(cmd));
		if (command) {
			command.run(message, args);
		}
	}

};
