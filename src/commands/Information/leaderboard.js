// >> Modules
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
require('dotenv').config();

// >> Imports
const dbCon = require('../../../dbConnect.js');

// >> Function
module.exports = {
	data: new SlashCommandBuilder()
		.setName('leaderboard')
		.setDescription('🔱 Check top users on server')
		.addStringOption((option) =>
			option
				.setName('howmuch')
				.setRequired(false)
				.setDescription("The amount user you'd like to check. (3-20)")
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
			let user = interaction.member.user;
			let member = interaction.member;
			let limit = 10;
			if (interaction.options.getString('howmuch')) {
				let number = Number(interaction.options.getString('howmuch'));
				if (number >= 3 && number <= 20) {
					limit = number;
				} else {
					//Reply embed creation
					const replyEmbed = new MessageEmbed()
						.setColor(process.env.command_top_number_error_color)
						.setTitle(process.env.command_top_number_error_title)
						.setDescription(
							process.env.command_top_number_error_desc
						)
						.setTimestamp()
						.setFooter({
							text: interaction.member.user.username,
							iconURL: interaction.member.user.displayAvatarURL(),
						});
					return await interaction.reply({
						embeds: [replyEmbed],
						ephemeral: true,
					});
				}
			}
			// Database check
			dbCon.query(
				`SELECT * FROM lp_users ORDER BY totalexp DESC LIMIT ${limit}`,
				async function (err, result, fields) {
					if (err) {
						console.log(err);
					} else {
						if (result.length > 0) {
							let usersString = '';
							for (let i = 0; i < result.length; i++) {
								if (i === 0) {
									usersString = `🔱 **${i + 1}.** <@${
										result[i].user_id
									}>, Level: \`${result[i].level}\`, EXP: \`${
										result[i].totalexp
									}\`\n`;
								} else if (i === 1) {
									usersString =
										usersString +
										`⚜️ **${i + 1}.** <@${
											result[i].user_id
										}>, Level: \`${
											result[i].level
										}\`, EXP: \`${result[i].totalexp}\`\n`;
								} else if (i === 2) {
									usersString =
										usersString +
										`🔰 **${i + 1}.** <@${
											result[i].user_id
										}>, Level: \`${
											result[i].level
										}\`, EXP: \`${result[i].totalexp}\`\n`;
								} else {
									usersString =
										usersString +
										`**${i + 1}.** <@${
											result[i].user_id
										}>, Level: \`${
											result[i].level
										}\`, EXP: \`${result[i].totalexp}\`\n`;
								}
							}
							const replyEmbed = new MessageEmbed()
								.setColor('#FEDB25')
								.addFields({
									name: `**Top ${result.length} members**`,
									value: usersString,
								})
								.setTimestamp()
								.setFooter({
									text: interaction.member.user.username,
									iconURL:
										interaction.member.user.displayAvatarURL(),
								});
							await interaction.reply({
								embeds: [replyEmbed],
							});
						}
					}
				}
			);
		}
	},
};
