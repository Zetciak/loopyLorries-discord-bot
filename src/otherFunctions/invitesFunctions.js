// >> Modules
require('dotenv').config();

// >> Imports
const dbCon = require('../../dbConnect.js');

// >> Variables
let globalClient;
let clientInvites = new Array();

// >> Main function
function mainFunction(client, invites) {
	console.log(`[BOT]: Invites functions loaded!`);
	globalClient = client;
}

// >> Invite create function
function newInvite(invite) {
	clientInvites[invite.code] = invite.uses;
}

// >> Member join
function newMember(member) {
	member.guild.invites.fetch().then((guildInvites) => {
		guildInvites.each((invite) => {
			if (invite.uses != clientInvites[invite.code]) {
				clientInvites[invite.code] = invite.uses;
				//Check same user
				dbCon.query(
					`SELECT * FROM lp_invites WHERE inviter='${invite.inviter.id}' AND invited='${member.user.id}' LIMIT 1`,
					async function (err, result, fields) {
						if (err) {
							console.log(err);
						} else {
							if (result.length > 0) {
								// Update leaved to 0
								dbCon.query(
									`UPDATE lp_invites SET leaved='0' WHERE invited='${member.user.id}' AND inviter='${invite.inviter.id}'`,
									async function (err2, result2, fields2) {
										if (err2) {
											console.log(err2);
										} else {
										}
									}
								);

								// Add invite number
								dbCon.query(
									`UPDATE lp_users SET invited=invited+1 WHERE user_id='${invite.inviter.id}'`,
									async function (err2, result2, fields2) {
										if (err2) {
											console.log(err2);
										} else {
										}
									}
								);
							} else {
								// Sent user to database
								dbCon.query(
									`INSERT INTO lp_invites (inviter, invited) VALUES ('${invite.inviter.id}', '${member.user.id}')`,
									async function (err2, result2, fields2) {
										if (err2) {
											console.log(err2);
										} else {
										}
									}
								);

								// Add invite number
								dbCon.query(
									`UPDATE lp_users SET invited=invited+1 WHERE user_id='${invite.inviter.id}'`,
									async function (err2, result2, fields2) {
										if (err2) {
											console.log(err2);
										} else {
										}
									}
								);
							}
						}
					}
				);
			}
		});
	});
}

// >> Member leaved
function deleteMember(member) {
	dbCon.query(
		`SELECT * FROM lp_invites WHERE invited='${member.user.id}' AND leaved='0'`,
		async function (err, result, fields) {
			if (err) {
				console.log(err);
			} else {
				if (result.length > 0) {
					dbCon.query(
						`UPDATE lp_invites SET leaved='1' WHERE invited='${member.user.id}' AND leaved='0'`,
						async function (err2, result2, fields2) {
							if (err2) {
								console.log(err2);
							} else {
							}
						}
					);
					dbCon.query(
						`UPDATE lp_users SET invited=invited-1 WHERE user_id='${result[0].inviter}'`,
						async function (err2, result2, fields2) {
							if (err2) {
								console.log(err2);
							} else {
							}
						}
					);
				}
			}
		}
	);
}

module.exports = { mainFunction, newInvite, newMember, deleteMember };
