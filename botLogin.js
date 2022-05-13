// >> Modules
const { Client, Intents, Collection } = require('discord.js');
const fs = require('fs');
require('dotenv').config();

// >> Imports
const { dbCon } = require('./dbConnect.js');

// >> Bot startup
const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_PRESENCES,
		Intents.FLAGS.GUILD_INVITES,
	],
});

client.commands = new Collection();
client.buttons = new Collection();
client.invites = new Collection();

const solorisBotFunctions = fs
	.readdirSync('./src/functions')
	.filter((file) => file.endsWith('.js'));
const solorisBotEventFiles = fs
	.readdirSync('./src/events')
	.filter((file) => file.endsWith('.js'));
const solorisBotCommandFolders = fs.readdirSync('./src/commands');

(async () => {
	for (solorisBotFiles of solorisBotFunctions) {
		require(`./src/functions/${solorisBotFiles}`)(client);
	}
	client.handleEvents(solorisBotEventFiles, './src/events');
	client.handleCommands(solorisBotCommandFolders, './src/commands');
	client.handleButtons();
	client.login(process.env.botToken);
})();
