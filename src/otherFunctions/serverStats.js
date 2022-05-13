// >> Modules
require('dotenv').config();

// >> Variables
let statsRefreshTime = 1000 * 60 * 10; // 10 minutes
let globalClient;
let guild;

// >> Main function
function mainFunction(client) {
	console.log(`[BOT]: Server stats functions loaded!`);
	globalClient = client;
	guild = client.guilds.cache.get(process.env.serverId);

	// Refreshing the stats
	async function refreshStats() {
		await guild.members.fetch();

		// Boosters refresh
		let boosterRole = guild.roles.cache.find(
			(role) => role.id === process.env.boosterRole
		);
		let totalBoosterRole = boosterRole.members.map((m) => m.id).length;
		let boosterCountChannel = await globalClient.channels.fetch(
			process.env.boosterCountChannel
		);
		if (boosterCountChannel) {
			boosterCountChannel.setName(`〔✨〕Boosters: ${totalBoosterRole}`);
		}

		// Members refresh
		let membersCountChannel = await globalClient.channels.fetch(
			process.env.membersCountChannel
		);
		if (membersCountChannel) {
			membersCountChannel.setName(
				`〔🌴〕Population: ${guild.memberCount}`
			);
		}

		// Online refresh
		let onlineMembers = (await guild.members.fetch()).filter(
			(member) =>
				!member.user.bot &&
				member.presence &&
				member.presence.status !== 'offline'
		);
		let totalOnlineMembers = onlineMembers.map((m) => m.id).length;
		let onlineCountChannel = await globalClient.channels.fetch(
			process.env.onlineCountChannel
		);
		if (onlineCountChannel) {
			onlineCountChannel.setName(`〔🎯〕Online: ${totalOnlineMembers}`);
		}
	}

	refreshStats();

	setInterval(function () {
		refreshStats();
	}, statsRefreshTime);
}

module.exports = { mainFunction };
