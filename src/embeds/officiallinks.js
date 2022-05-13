// >> Modules
require('dotenv').config();
const { MessageEmbed } = require('discord.js');

// >> Imports
const dbCon = require('../../dbConnect.js');

// >> Variables
let embedName = 'officiallinks';

// >> Main function
async function sendEmbed(interaction, client) {
	//Embed creation
	const embed = new MessageEmbed()
		.setColor('90FF59')
		.setAuthor({
			name: 'Only the links below are official',
			iconURL: 'https://i.imgur.com/yzsndlI.png',
		})
		.setDescription(
			'Discord: https://discord.gg/JdxwwZfpXh\nTwitter: https://twitter.com/LoopyLorisTribe\nPage: TBA'
		)
		.setFooter({
			text: 'DO NOT CLICK ON LINKS FROM OTHER PLACES!',
		});

	const message = await interaction.channel.send({
		embeds: [embed],
	});

	//Get old message and delete it
	dbCon.query(
		`SELECT * FROM lp_embeds WHERE name='${embedName}'`,
		async function (err, result, fields) {
			if (err) {
				console.log(err);
			} else {
				if (result.length > 0) {
					const channel = await client.channels.fetch(
						result[result.length - 1].channel_id
					);

					try {
						await channel.messages
							.fetch(result[result.length - 1].message_id)
							.then((message) => message.delete());
					} catch (error) {
						return;
					}
					//Get old message and delete it
					dbCon.query(
						`DELETE FROM lp_embeds WHERE id='${
							result[result.length - 1].id
						}'`,
						async function (err, result, fields) {}
					);
				}
			}
		}
	);

	//Insert new embed values
	dbCon.query(
		`INSERT INTO lp_embeds (name, channel_id, message_id) VALUES ('${embedName}', '${message.channel.id}', '${message.id}')`,
		async function (err, result, fields) {}
	);
}

module.exports = { sendEmbed };
