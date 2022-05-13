// >> Modules
require('dotenv').config();
const { MessageEmbed } = require('discord.js');

// >> Imports
const dbCon = require('../../dbConnect.js');

// >> Variables
let embedName = 'CoconutRaffles';

// >> Main function
async function sendEmbed(interaction, client) {
	//Embed creation
	const embed = new MessageEmbed()
		.setColor('#d1d1d1')
		.setTitle('🥥⠀Raffle')
		.setDescription(
			`The first giveaway is coming in the next week. Prepare and get as many coconuts as possible to be able to buy more tickets and have a higher chance of winning!`
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
