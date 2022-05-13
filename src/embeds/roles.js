// >> Modules
require('dotenv').config();
const { MessageEmbed } = require('discord.js');

// >> Imports
const dbCon = require('../../dbConnect.js');

// >> Variables
let embedName = 'roles';

// >> Main function
async function sendEmbed(interaction, client) {
	//Embed creation
	const embed = new MessageEmbed()
		.setColor('#90FF59')
		.setAuthor({
			name: 'Roles',
			iconURL: 'https://i.imgur.com/SGX67HZ.png',
		})
		.setDescription(
			'**<@&952592856038666311>**\nYou have a spot to claim your throne - You are Whitelisted.\n\n**<@&952592856021880843>**\nDon’t forget the sprinkles!! - You are a verified member of our community.\n\n**<@&955928455269187674>**\nYou are a professional gamer - You’ll get notifications about upcoming gaming sessions\n\n**<@&952605163670093865>**\nYou backed the server by boosting us - You are a Nitro booster. Thank you!\n\n**Level 1-4 (<@&952592856021880840>)**\nClimbing a Palm tree.\n\n**Level 5-14 (<@&952592856021880839>)**\nHiding from poachers.\n\n**Level 15-24 (<@&952592856021880838>)**\nYour beta senses are tingling; a change of events coming…\n\n**Level 25-39 (<@&952592856021880837>)**\nYou climbed to the top of the tree.\n\n**Level 40+ (<@&952592856021880836>)**\nThe poachers are nowhere to be found, You are in paradise drinking a piña colada.'
		);

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
