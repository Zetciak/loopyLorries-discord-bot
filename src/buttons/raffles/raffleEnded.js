// >> Modules
const { MessageEmbed } = require('discord.js');
require('dotenv').config();

// >> Function
module.exports = {
	data: {
		name: `raffleEnded`,
	},
	async execute(interaction, client) {
		// Reply embed creation
		const replyEmbed = new MessageEmbed()
			.setColor('#ff4242')
			.setTitle('Ooops!')
			.setDescription('This raffle ended!')
			.setFooter({
				text: interaction.member.user.username,
				iconURL: interaction.member.user.displayAvatarURL(),
			});

		await interaction.reply({
			embeds: [replyEmbed],
			ephemeral: true,
		});
	},
};
