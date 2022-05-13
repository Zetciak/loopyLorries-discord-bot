// >> Modules
const { MessageEmbed } = require('discord.js');
require('dotenv').config();

// >> Imports
const dbCon = require('../../../dbConnect.js');

// >> Function
module.exports = {
	data: {
		name: `claimFreeCoconuts`,
	},
	async execute(interaction, client) {
		//Get last claim
		dbCon.query(
			`SELECT * FROM lp_users WHERE user_id="${interaction.member.id}"`,
			async function (error, result, fields) {
				if (error) {
					console.log(error);
				} else {
					if (result.length > 0) {
						let nowTimestamp = Number(Date.now());
						let dbTimestamp = Number(result[0].lastFreeCoconuts);
						let db24h = dbTimestamp + 86400000;
						let comeBack = (
							(Number(nowTimestamp) + 86400000) /
							1000
						).toFixed(0);
						let comeBackError = (Number(db24h) / 1000).toFixed(0);
						if (db24h <= nowTimestamp) {
							// Mozesz odebrac coconutsy
							const embed = new MessageEmbed()
								.setColor('#d1d1d1')
								.setAuthor({
									name: `🥥 Success`,
								})
								.setDescription(
									`You've picked up your 3 free coconuts, come back in **<t:${comeBack}:R>**.`
								)
								.setTimestamp()
								.setFooter({
									text: interaction.member.user.username,
									iconURL:
										interaction.member.user.displayAvatarURL(),
								});
							await interaction.reply({
								embeds: [embed],
								ephemeral: true,
							});

							// Dodaj coconutsy
							let tickets = result[0].tickets;
							dbCon.query(
								`UPDATE lp_users SET tickets='${
									tickets + 3
								}', lastFreeCoconuts="${Number(
									nowTimestamp
								)}"  WHERE user_id='${interaction.member.id}'`,
								async function () {}
							);
						} else {
							// Mozesz odebrac coconutsy
							const embed = new MessageEmbed()
								.setColor('#ff4242')
								.setAuthor({
									name: `❌ Error!`,
								})
								.setDescription(
									`You've already picked up your coconuts today, come back in **<t:${comeBackError}:R>**.`
								)
								.setTimestamp()
								.setFooter({
									text: interaction.member.user.username,
									iconURL:
										interaction.member.user.displayAvatarURL(),
								});
							await interaction.reply({
								embeds: [embed],
								ephemeral: true,
							});
						}
					} else {
						// Error costam db
						const embed = new MessageEmbed()
							.setColor('#ff4242')
							.setAuthor({
								name: '❌ Error!',
							})
							.setDescription(`User not found!`)
							.setTimestamp()
							.setFooter({
								text: interaction.member.user.username,
								iconURL:
									interaction.member.user.displayAvatarURL(),
							});

						//Reply
						await interaction.reply({
							embeds: [embed],
							ephemeral: true,
						});
					}
				}
			}
		);
	},
};
