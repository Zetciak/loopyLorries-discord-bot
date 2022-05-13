// >> Modules
const { MessageEmbed } = require('discord.js');
require('dotenv').config();

// >> Function
module.exports = {
	data: {
		name: `claimOg`,
	},
	async execute(interaction, client) {
		if (
			interaction.member.roles.cache.some(
				(role) => role.id === '952592856038666313'
			) &&
			interaction.member.roles.cache.some(
				(role) => role.id === '952592856038666311'
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
				(role) => role.id === '952592856038666313'
			);
			interaction.member.roles.add(role);

			const role2 = interaction.member.guild.roles.cache.find(
				(role) => role.id === '952592856038666311'
			);
			interaction.member.roles.add(role2);

			//Reply embed creation
			const replyEmbed = new MessageEmbed()
				.setColor(process.env.button_role_ogwl_color)
				.setTitle(process.env.button_role_ogwl_title)
				.setDescription(process.env.button_role_ogwl_desc);

			await interaction.reply({
				embeds: [replyEmbed],
				ephemeral: true,
			});
		}
	},
};
