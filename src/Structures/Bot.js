const Database = require('better-sqlite3');
const { Client, Collection, Intents } = require('discord.js');
const Util = require('./Util');

module.exports = class Bot extends Client {

	constructor(options) {
		super({
			presence: {
				status: 'dnd',
				activities: [
					{
						name: '.gg/ditch',
						type: 'WATCHING',
					},
				],
			},
			intents: [
				Intents.FLAGS.GUILDS,
				Intents.FLAGS.GUILD_MESSAGES,
				Intents.FLAGS.GUILD_PRESENCES,
			],
		});

		this.validate(options);

		this.events = new Collection();
		this.commands = new Collection();
		this.aliases = new Collection();

		this.utils = new Util(this);

		this.db = new Database('/opt/ditch/users.sqlite');

		const table = this.db.prepare('SELECT count(*) FROM sqlite_master WHERE type=\'table\' AND name = \'users\';').get();

		if (!table['count(*)']) {
			this.db.prepare('CREATE TABLE users (id TEXT PRIMARY KEY, experience INTEGER, level INTEGER, lastExperience INTEGER);').run();
			this.db.prepare('CREATE UNIQUE INDEX idx_users_id ON users (id);').run();
			this.db.pragma('synchronous = 1');
			this.db.pragma('journal_mode = wal');
		}
	}

	validate(options) {
		if (typeof options !== 'object') throw new TypeError('Options must an object.');

		if (!options.prefix) throw new Error('No prefix provided for the client.');
		if (typeof options.prefix !== 'string') throw new TypeError('Prefix must be a string.');
		this.prefix = options.prefix;

		if (!options.token) throw new Error('No token provided for the client.');
		if (typeof options.token !== 'string') throw new TypeError('Token must be a string.');
		this.token = options.token;

		if (!options.color) throw new Error('No color provided for the client.');
		if (typeof options.color !== 'string') throw new TypeError('Color must be a string.');
		this.color = options.color;

		if (!options.cooldown) throw new Error('No cooldown provided for the client.');
		if (typeof options.cooldown !== 'number') throw new TypeError('Cooldown must be a number.');
		this.cooldown = options.cooldown;
	}

	async start(token = this.token) {
		this.utils.loadCommands();
		this.utils.loadEvents();

		await super.login(token);
	}
};
