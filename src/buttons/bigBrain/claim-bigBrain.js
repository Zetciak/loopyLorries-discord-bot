// >> Modules
const { MessageEmbed } = require('discord.js');
require('dotenv').config();

// >> Function
module.exports = {
	data: {
		name: `claimBigBrain`,
	},
	async execute(interaction, client) {
		if (
			interaction.member.roles.cache.some(
				(role) => role.id === process.env.bigBrainRole
			)
		) {
			//User have role
			//Reply embed creation
			const replyEmbed = new MessageEmbed()
				.setColor(process.env.button_role_error_has_role_color)
				.setTitle(process.env.button_role_error_has_role_title)
				.setDescription(process.env.button_role_error_has_role_desc);

			await interaction.reply({
				embeds: [replyEmbed],
				ephemeral: true,
			});
		} else {
			//User dont have role
			const role = interaction.member.guild.roles.cache.find(
				(role) => role.id === process.env.bigBrainRole
			);
			interaction.member.roles.add(role);

			//Reply embed creation
			const replyEmbed = new MessageEmbed()
				.setColor(process.env.button_role_success_color)
				.setTitle(process.env.button_role_success_title)
				.setDescription(process.env.button_role_success_desc);

			await interaction.reply({
				embeds: [replyEmbed],
				ephemeral: true,
			});
		}
	},
};
