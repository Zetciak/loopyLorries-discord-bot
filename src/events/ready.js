// >> Modules
require('dotenv').config();
const snekfetch = require('snekfetch');

// >> Imports
const dbCon = require('../../dbConnect.js');
const upTime = require('./../otherFunctions/upTime.js');
const twitterCounter = require('./../otherFunctions/twitterCounter.js');
const dbPinger = require('./../otherFunctions/dbPinger.js');
const serverStats = require('./../otherFunctions/serverStats.js');
const expCounter = require('./../otherFunctions/expCounter.js');
const invitesFunctions = require('./../otherFunctions/invitesFunctions.js');
const raffles = require('./../otherFunctions/raffles.js');

// >> Functions
module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		console.log(`[BOT]: Logged as ${client.user.tag}!`);
		client.user.setActivity('🌴 Loopy Lorries 🌴', { type: 'WATCHING' });

		// Start other functions
		upTime.mainFunction(client);
		twitterCounter.mainFunction(client);
		dbPinger.mainFunction(client);
		serverStats.mainFunction(client);
		expCounter.mainFunction(client);
		invitesFunctions.mainFunction(client);
		raffles.mainFunction(client);

		// Fetch invites
		let guild = client.guilds.cache.get(process.env.serverId);
		guild.invites.fetch().then((guildInvites) => {
			guildInvites.each((guildInvite) => {
				invitesFunctions.newInvite(guildInvite);
			});
		});
	},
};
