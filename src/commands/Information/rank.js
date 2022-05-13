// >> Modules
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
require('dotenv').config();

// >> Imports
const dbCon = require('../../../dbConnect.js');

// >> Function
module.exports = {
	data: new SlashCommandBuilder()
		.setName('rank')
		.setDescription('🔱 Check ranking on server')
		.addUserOption((option) =>
			option
				.setName('target')
				.setRequired(false)
				.setDescription("The user you'd like to check.")
		),
	async execute(interaction, client) {
		// Check correct channel
		let botAdmin = interaction.member.roles.cache.some(
			(role) => role.id === process.env.privateAdminRole
		);
		if (
			!botAdmin &&
			interaction.channelId !== process.env.commandsChannel
		) {
			//Embed creation
			const embed = new MessageEmbed()
				.setColor(process.env.command_channel_error_color)
				.setTitle(process.env.command_channel_error_title)
				.setDescription(process.env.command_channel_error_desc)
				.setTimestamp()
				.setFooter({
					text: interaction.member.user.username,
					iconURL: interaction.member.user.displayAvatarURL(),
				});

			//Reply
			await interaction.reply({
				embeds: [embed],
				ephemeral: true,
			});
		} else {
			let user;
			let member;
			// Getting user from command
			if (interaction.options.getUser('target')) {
				// Zmienne oznaczonego usera
				user = interaction.options.getUser('target');
				member = await interaction.guild.members.fetch(user.id);

				//Nie ma takiego usera
				if (!member) {
					return await interaction.reply({
						content: 'The user mentioned is not within the server.',
						ephemeral: true,
					});
				}
			} else {
				user = interaction.member.user;
				member = interaction.member;
			}
			// Database check
			dbCon.query(
				`SELECT * FROM lp_users WHERE user_id='${user.id}' LIMIT 1`,
				async function (err, result, fields) {
					if (err) {
						console.log(err);
					} else {
						if (result.length > 0) {
							// User found in db
							// Count rank
							dbCon.query(
								`SELECT COUNT(id) AS rank FROM lp_users WHERE totalexp > ${result[0].totalexp}`,
								async function (err, result2, fields) {
									if (err) {
										console.log(err);
									} else {
										dbCon.query(
											`SELECT id FROM lp_users`,
											async function (
												err,
												result3,
												fields
											) {
												if (err) {
													console.log(err);
												} else {
													let rank =
														Number(
															result2[0].rank
														) + 1;
													let all = Number(
														result3.length
													);
													let level = Number(
														result[0].level
													);
													let exp = Number(
														result[0].exp
													);
													let nextLevelExp =
														level * 100;
													let levelProcent = (
														(exp / nextLevelExp) *
														100
													).toFixed(2);
													const replyEmbed =
														new MessageEmbed()
															.setColor('#FEDB25')
															.setAuthor({
																name: `${user.username}'s rank`,
																iconURL:
																	user.displayAvatarURL(),
															})
															.addFields({
																name: '**Ranking checker**',
																value: `**Ranking:** #${rank} (out of ${all})\n**Level:** ${level}\n**EXP:** ${exp}/${nextLevelExp} (${levelProcent}%)`,
															})
															.setTimestamp()
															.setFooter({
																text: interaction
																	.member.user
																	.username,
																iconURL:
																	interaction.member.user.displayAvatarURL(),
															});
													await interaction.reply({
														embeds: [replyEmbed],
													});

													// Update avatar
													dbCon.query(
														`UPDATE lp_users SET avatarURL='${user.displayAvatarURL()}' WHERE user_id='${
															user.id
														}'`,
														async function () {}
													);
												}
											}
										);
									}
								}
							);
						} else {
							// User not found
							//Reply embed creation
							const replyEmbed = new MessageEmbed()
								.setColor(
									process.env
										.command_rank_not_found_error_color
								)
								.setTitle(
									process.env
										.command_rank_not_found_error_title
								)
								.setDescription(
									process.env
										.command_rank_not_found_error_desc
								)
								.setTimestamp()
								.setFooter({
									text: interaction.member.user.username,
									iconURL:
										interaction.member.user.displayAvatarURL(),
								});
							await interaction.reply({
								embeds: [replyEmbed],
								ephemeral: true,
							});
						}
					}
				}
			);
		}
	},
};
