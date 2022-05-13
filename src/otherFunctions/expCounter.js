// >> Modules
require('dotenv').config();

// >> Imports
const dbCon = require('../../dbConnect.js');

// >> Variables
let globalClient;
let usersTimers = new Array();
let levelBooster = Number(process.env.levelBooster);
let levelMaxEXP = Number(process.env.levelMaxEXP) * levelBooster;
let levelMinEXP = Number(process.env.levelMinEXP) * levelBooster;
let levelResetTime = Number(process.env.levelResetTime);

// >> Main function
function mainFunction(client) {
	console.log(`[BOT]: Exp Counter functions loaded!`);
	globalClient = client;

	// Czyszczenie sekund userów
	function minusSecond() {
		for (const [key, value] of Object.entries(usersTimers)) {
			if (value > 0) {
				usersTimers[key] = value - 1;
			} else {
				delete usersTimers[key];
			}
		}
	}

	setInterval(function () {
		minusSecond();
	}, 1000);
}

// >> Checking exp to receive
function checkExp(message) {
	if (!usersTimers[message.author.id]) {
		let content = message.content;
		let countExp = (content.length / 10) * levelBooster;
		if (countExp < levelMinEXP) {
			countExp = levelMinEXP;
		} else if (countExp > levelMaxEXP) {
			countExp = levelMaxEXP;
		}
		countExp = countExp.toFixed();
		usersTimers[message.author.id] = levelResetTime;

		//Database querry
		dbCon.query(
			`SELECT * FROM lp_users WHERE user_id='${message.author.id}'`,
			async function (err, result, fields) {
				if (err) {
					console.log(err);
				} else {
					if (result.length > 0) {
						let userLevel = Number(result[0].level);
						let userExp = Number(result[0].exp) + Number(countExp);
						let nextLevelExp = Number(result[0].level) * 100;
						let totalExp =
							Number(result[0].totalexp) + Number(countExp);
						if (userExp >= nextLevelExp) {
							userExp = userExp - nextLevelExp;
							userLevel = userLevel + 1;
							checkLevelRole(message, userLevel);
						}
						//console.log(
						//	`level='${userLevel}', exp='${userExp}', totalexp='${totalExp}' ---- ${countExp}`
						//);
						// Update info in db
						dbCon.query(
							`UPDATE lp_users SET level='${userLevel}', exp='${userExp}', totalexp='${totalExp}' WHERE user_id='${message.author.id}'`,
							async function () {}
						);
					}
				}
			}
		);
	}
}

// >> Checking exp to receive
async function checkLevelRole(message, level) {
	level = Number(level);
	let guild = globalClient.guilds.cache.get(process.env.serverId);
	let member = await guild.members.fetch(message.author.id);

	if (member) {
		if (level === Number(process.env.levelAmount2)) {
			const oldRole = member.guild.roles.cache.find(
				(role) => role.id === process.env.levelRole1
			);
			const newRole = member.guild.roles.cache.find(
				(role) => role.id === process.env.levelRole2
			);
			member.roles.remove(oldRole);
			member.roles.add(newRole);
		} else if (level === Number(process.env.levelAmount3)) {
			const oldRole = member.guild.roles.cache.find(
				(role) => role.id === process.env.levelRole2
			);
			const newRole = member.guild.roles.cache.find(
				(role) => role.id === process.env.levelRole3
			);
			member.roles.remove(oldRole);
			member.roles.add(newRole);
		} else if (level === Number(process.env.levelAmount4)) {
			const oldRole = member.guild.roles.cache.find(
				(role) => role.id === process.env.levelRole3
			);
			const newRole = member.guild.roles.cache.find(
				(role) => role.id === process.env.levelRole4
			);
			member.roles.remove(oldRole);
			member.roles.add(newRole);
		} else if (level === Number(process.env.levelAmount5)) {
			const oldRole = member.guild.roles.cache.find(
				(role) => role.id === process.env.levelRole4
			);
			const newRole = member.guild.roles.cache.find(
				(role) => role.id === process.env.levelRole5
			);
			member.roles.remove(oldRole);
			member.roles.add(newRole);
		}
	}
}

module.exports = { mainFunction, checkExp };
