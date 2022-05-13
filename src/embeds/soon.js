// >> Modules
require('dotenv').config();
const { MessageEmbed } = require('discord.js');

// >> Main function
async function sendEmbed(interaction, client) {
	//Embed creation
	const embed = new MessageEmbed()
		.setColor('#ffda1f')
		.setAuthor({
			name: 'Loopy Loris Tribe',
			iconURL: 'https://i.imgur.com/XFUmXax.png',
		})
		.setDescription('Coming soon!');

	const message = await interaction.channel.send({
		embeds: [embed],
	});
}

module.exports = { sendEmbed };
