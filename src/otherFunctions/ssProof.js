// >> Modules
const { MessageEmbed } = require('discord.js');
require('dotenv').config();

// >> Main function
function mainFunction(message, client) {
	if (message.channel.id === '966075650467328061') {
		if (message.attachments.size > 0) {
			if (message.attachments.first().contentType) {
				if (!message.attachments.first().contentType.search('image')) {
					// GUT
				} else {
					deleteAndSendDM(message, client);
				}
			} else {
				deleteAndSendDM(message, client);
			}
		} else {
			deleteAndSendDM(message, client);
		}
	}
}

// >> Send DM message
function deleteAndSendDM(message, client) {
	const embed = new MessageEmbed()
		.setColor('#ff4242')
		.setAuthor({
			name: '❌ Error!',
		})
		.setDescription(
			`Hey <@${message.author.id}>\nSending messages on <#${message.channel.id}> is blocked!\nYou can only send images on that channel!`
		)
		.setTimestamp()
		.setFooter({
			text: message.author.username,
			iconURL: message.author.displayAvatarURL(),
		});

	message.author
		.send({
			embeds: [embed],
		})
		.catch(() => {})
		.then(async () => {
			message.delete();
		});
}

module.exports = { mainFunction };
