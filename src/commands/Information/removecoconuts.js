// >> Modules
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
require('dotenv').config();

// >> Imports
const dbCon = require('../../../dbConnect.js');

// >> Function
module.exports = {
	data: new SlashCommandBuilder()
		.setName('removecoconuts')
		.setDescription('🥥💠 Remove user coconuts (mod)')
		.addUserOption((option) =>
			option
				.setName('target')
				.setRequired(true)
				.setDescription("The user you'd like to remove coconuts.")
		)
		.addStringOption((option) =>
			option
				.setName('howmuch')
				.setRequired(true)
				.setDescription(
					"The amount of coconuts you'd like to remove. (1-15)"
				)
		),
	async execute(interaction, client) {
		if (
			interaction.member.roles.cache.some(
				(role) => role.id === process.env.moderatorRole
			) ||
			interaction.member.roles.cache.some(
				(role) => role.id === process.env.adminRole
			)
		) {
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
			}
			if (user && member) {
				let count = 1;
				if (interaction.options.getString('howmuch')) {
					let number = Number(
						interaction.options.getString('howmuch')
					);
					if (number >= 1 && number <= 15) {
						count = number;
					} else {
						//Reply embed creation
						const replyEmbed = new MessageEmbed()
							.setColor('#ff4242')
							.setTitle('Oops!')
							.setDescription(
								'Please select number between 1 and 15.'
							)
							.setTimestamp()
							.setFooter({
								text: interaction.member.user.username,
								iconURL:
									interaction.member.user.displayAvatarURL(),
							});
						return await interaction.reply({
							embeds: [replyEmbed],
							ephemeral: true,
						});
					}
				}

				// User jest git, ilość też
				dbCon.query(
					`SELECT * FROM lp_users WHERE user_id='${user.id}' LIMIT 1`,
					async function (err, result, fields) {
						if (err) {
							console.log(err);
						} else {
							if (result.length > 0) {
								// User found in db
								let tickets = result[0].tickets;
								dbCon.query(
									`UPDATE lp_users SET tickets='${
										tickets - count
									}' WHERE user_id='${user.id}'`,
									async function () {}
								);

								// Sent log to database
								dbCon.query(
									`INSERT INTO lp_admin_logs (user, log) VALUES ('${interaction.member.user.username}', '/removecoconuts ${user.username} ${count}')`,
									async function (err2, result2, fields2) {
										if (err2) {
											console.log(err2);
										} else {
										}
									}
								);

								// Reply
								const replyEmbed = new MessageEmbed()
									.setColor('#d1d1d1')
									.setAuthor({
										name: `${user.username}`,
										iconURL: user.displayAvatarURL(),
									})
									.setDescription(
										`🥥 **${count} coconut** have been remove from the user's account.`
									)
									.setTimestamp()
									.setFooter({
										text: interaction.member.user.username,
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
		} else {
			//Embed creation
			const embed = new MessageEmbed()
				.setColor(process.env.command_permissions_error_color)
				.setTitle(process.env.command_permissions_error_title)
				.setDescription(process.env.command_permissions_error_desc)
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
		}
	},
};
