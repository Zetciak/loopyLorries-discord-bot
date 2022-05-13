// >> Modules
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
require('dotenv').config();

// >> Imports
const dbCon = require('../../../dbConnect.js');

// >> Function
module.exports = {
	data: new SlashCommandBuilder()
		.setName('invites')
		.setDescription('🔰 Check invites count on server')
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
				`SELECT COUNT(id) AS realInvites FROM lp_invites WHERE leaved='0' AND inviter='${user.id}'`,
				async function (err, result1, fields) {
					if (err) {
						console.log(err);
					} else {
						dbCon.query(
							`SELECT COUNT(id) AS fakeInvites FROM lp_invites WHERE leaved='1' AND inviter='${user.id}'`,
							async function (err, result2, fields) {
								if (err) {
									console.log(err);
								} else {
									let realInvites = Number(
										result1[0].realInvites
									);
									let fakeInvites = Number(
										result2[0].fakeInvites
									);
									let sumInvites = realInvites + fakeInvites;

									// Reply embed
									const replyEmbed = new MessageEmbed()
										.setColor('#FEDB25')
										.setAuthor({
											name: `${user.username}'s invites`,
											iconURL: user.displayAvatarURL(),
										})
										.setDescription(
											`✅ **Invited:** ${sumInvites}\n❌ **Leaved:** ${fakeInvites}\n✨ **Real invitations:** ${realInvites}`
										)
										.setTimestamp()
										.setFooter({
											text: interaction.member.user
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
		}
	},
};
