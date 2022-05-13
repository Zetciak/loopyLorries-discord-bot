// >> Modules
const { MessageEmbed } = require('discord.js');
require('dotenv').config();

// >> Imports
const dbCon = require('../../../dbConnect.js');

// >> Variables
/*
let pingChannels = new Array();
pingChannels[0] = '952638788344107128'; // Bulletin
pingChannels[1] = '952638964743946342'; // Sneak peeks
pingChannels[2] = '955846367857758288'; // How to get wl
pingChannels[3] = '952592856751673469'; // F.A.Q
pingChannels[4] = '952592856751673464'; // Official links
*/

// >> Function
module.exports = {
	data: {
		name: `verifyMeButton`,
	},
	async execute(interaction, client) {
		if (
			interaction.member.roles.cache.some(
				(role) => role.id === process.env.verifiedRole
			)
		) {
			//User have role
			//Reply embed creation
			const replyEmbed = new MessageEmbed()
				.setColor(process.env.button_verifier_has_role_color)
				.setTitle(process.env.button_verifier_has_role_title)
				.setDescription(process.env.button_verifier_has_role_desc);

			await interaction.reply({
				embeds: [replyEmbed],
				ephemeral: true,
			});
		} else {
			//User dont have role
			const role = interaction.member.guild.roles.cache.find(
				(role) => role.id === process.env.verifiedRole
			);
			interaction.member.roles.add(role);

			//Reply embed creation
			const replyEmbed = new MessageEmbed()
				.setColor(process.env.button_verifier_success_color)
				.setTitle(process.env.button_verifier_success_title)
				.setDescription(process.env.button_verifier_success_desc);

			//Ping user in channels
			/*for (const [key, value] of Object.entries(pingChannels)) {
				let pingChannel = await client.channels.fetch(value);
				pingChannel
					.send(`<@${interaction.member.user.id}>`)
					.then((msg) => {
						setTimeout(() => msg.delete(), 1);
					});
			}*/

			//Level check database
			dbCon.query(
				`SELECT * FROM lp_users WHERE user_id='${interaction.member.user.id}' LIMIT 1`,
				async function (err, result, fields) {
					if (err) {
						console.log(err);
					} else {
						if (result.length > 0) {
							// >> User is in database
							if (
								result[0].level <
								Number(process.env.levelAmount2)
							) {
								const role =
									interaction.member.guild.roles.cache.find(
										(role) =>
											role.id === process.env.levelRole1
									);
								interaction.member.roles.add(role);
							} else if (
								result[0].level >=
									Number(process.env.levelAmount2) &&
								result[0].level <
									Number(process.env.levelAmount3)
							) {
								const role =
									interaction.member.guild.roles.cache.find(
										(role) =>
											role.id === process.env.levelRole2
									);
								interaction.member.roles.add(role);
							} else if (
								result[0].level >=
									Number(process.env.levelAmount3) &&
								result[0].level <
									Number(process.env.levelAmount4)
							) {
								const role =
									interaction.member.guild.roles.cache.find(
										(role) =>
											role.id === process.env.levelRole3
									);
								interaction.member.roles.add(role);
							} else if (
								result[0].level >=
									Number(process.env.levelAmount4) &&
								result[0].level <
									Number(process.env.levelAmount5)
							) {
								const role =
									interaction.member.guild.roles.cache.find(
										(role) =>
											role.id === process.env.levelRole4
									);
								interaction.member.roles.add(role);
							} else if (
								result[0].level >=
								Number(process.env.levelAmount5)
							) {
								const role =
									interaction.member.guild.roles.cache.find(
										(role) =>
											role.id === process.env.levelRole5
									);
								interaction.member.roles.add(role);
							}
						} else {
							// User is not in database
							const role =
								interaction.member.guild.roles.cache.find(
									(role) => role.id === process.env.levelRole1
								);
							interaction.member.roles.add(role);

							// Sent user to database
							dbCon.query(
								`INSERT INTO lp_users (user_name, user_id, level, exp, totalexp, avatarURL) VALUES ('${
									interaction.member.user.username
								}', '${
									interaction.member.user.id
								}', '1', '0', '0', '${interaction.member.user.displayAvatarURL()}')`,
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

			await interaction.reply({
				embeds: [replyEmbed],
				ephemeral: true,
			});
		}
	},
};
