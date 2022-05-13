// >> Modules
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
require('dotenv').config();

// >> Imports
const dbCon = require('../../../dbConnect.js');

// >> Function
module.exports = {
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('💠 Clear messages on channel (mod)')
		.addNumberOption((option) =>
			option
				.setName('howmuch')
				.setRequired(true)
				.setDescription(
					"The amount of messages you'd like to remove. (1-100)"
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
			let count = Number(interaction.options.getNumber('howmuch'));
			if (count > 0 && count <= 100) {
				// Fetch and delete messages
				const messages = await interaction.channel.messages.fetch({
					limit: count,
				});
				const { size } = messages;
				messages.forEach((message) => message.delete());

				//Embed creation
				const embed = new MessageEmbed()
					.setColor('#00ff00')
					.setTitle('Success!')
					.setDescription(`Deleting ${size} messages...`)
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
				//Embed creation
				const embed = new MessageEmbed()
					.setColor(process.env.command_permissions_error_color)
					.setTitle(process.env.command_permissions_error_title)
					.setDescription('Range is 1-100 messages!')
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
