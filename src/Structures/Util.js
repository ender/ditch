const path = require('path');
const { promisify } = require('util');
const glob = promisify(require('glob'));
const Command = require('./Command.js');
const Event = require('./Event.js');

module.exports = class Util {

	constructor(client) {
		this.client = client;
	}

	get directory() {
		return `${path.dirname(require.main.filename)}${path.sep}`;
	}

	randInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	capitalize(string) {
		return string.split(' ').map(str => str.slice(0, 1).toUpperCase() + str.slice(1)).join(' ');
	}

	getMember(message, toFind) {
		if (!toFind) return message.member;

		toFind = toFind.toLowerCase();

		let target = message.guild.members.cache.get(toFind);

		if (!target && message.mentions.members) {target = message.mentions.members.first();}

		if (!target && toFind) {
			target = message.guild.members.cache.find(member => {
				return member.displayName.toLowerCase().includes(toFind) ||
					member.user.tag.toLowerCase().includes(toFind);
			});
		}

		if (!target) target = message.member;

		return target;
	}

	getMemberExclusive(message, toFind) {
		if (!toFind) return null;

		toFind = toFind.toLowerCase();

		let target = message.guild.members.cache.get(toFind);

		if (!target && message.mentions.members) {target = message.mentions.members.first();}

		if (!target && toFind) {
			target = message.guild.members.cache.find(member => {
				return member.displayName.toLowerCase().includes(toFind) ||
					member.user.tag.toLowerCase().includes(toFind);
			});
		}

		return target;
	}

	getRole(guild, toFind) {
		toFind = toFind.toLowerCase();

		let target = guild.roles.cache.get(toFind);

		if (!target && toFind) {
			target = guild.roles.cache.find(role => {
				return role.name.toLowerCase().includes(toFind) ||
					role.id === toFind;
			});
		}

		if (!target) {
			guild.roles.create({ name: this.client.utils.capitalize(toFind), color: 'DEFAULT' }).then(role => {
				return role;
			});
		}

		return target;
	}

	getUser(id) {
		return this.client.db.prepare('SELECT * FROM users WHERE id = ?').get(id);
	}

	setUser(user) {
		return this.client.db.prepare('INSERT OR REPLACE INTO users (id, experience, level, lastExperience) VALUES (@id, @experience, @level, @lastExperience);')
			.run({ id: user.id, experience: user.experience, level: user.level, lastExperience: user.lastExperience });
	}

	isClass(input) {
		return typeof input === 'function'
			&& typeof input.prototype === 'object'
			&& input.toString().substring(0, 5) === 'class';
	}

	async loadCommands() {
		return glob(`${this.directory}Commands/**/*.js`).then(commands => {
			for (const commandFile of commands) {
				delete require.cache[commandFile];
				const { name } = path.parse(commandFile);
				const File = require(commandFile);
				if (!this.isClass(File)) throw new TypeError(`Command ${name} does not export a class.`);
				const command = new File(this.client, name.toLowerCase());
				if (!(command instanceof Command)) throw new TypeError(`Command ${name} does not belong in Commands.`);
				this.client.commands.set(command.name, command);
				if (command.aliases.length) {
					for (const alias of command.aliases) {
						this.client.aliases.set(alias, command.name);
					}
				}
			}
		});
	}

	async loadEvents() {
		return glob(`${this.directory}Events/**/*.js`).then(events => {
			for (const eventFile of events) {
				delete require.cache[eventFile];
				const { name } = path.parse(eventFile);
				const File = require(eventFile);
				if (!this.isClass(File)) throw new TypeError(`Event ${name} does not export a class.`);
				const event = new File(this.client, name);
				if (!(event instanceof Event)) throw new TypeError(`Event ${name} does not belong in Events.`);
				this.client.events.set(event.name, event);
				event.emitter[event.type](name, (...args) => event.run(...args));
			}
		});
	}

};
