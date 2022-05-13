// >> Modules
require('dotenv').config();
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');

// >> Imports
const dbCon = require('../../dbConnect.js');

// >> Variables
let embedName = 'Big Brain';

// >> Main function
async function sendEmbed(interaction, client) {
	//Embed creation
	const embed = new MessageEmbed()
		.setColor('#ff0068')
		.setTitle('🧠⠀Claim role')
		.setDescription(
			`Claim your <@&${process.env.bigBrainRole}> role to be notified about upcoming quizzes!\nCheck <#954445795267059774> for more.`
		);

	//Button creation
	const buttons = new MessageActionRow().addComponents(
		new MessageButton()
			.setCustomId(`claimBigBrain`)
			.setLabel(`🧠 Claim`)
			.setStyle(`SECONDARY`),
		new MessageButton()
			.setCustomId(`deleteBigBrain`)
			.setLabel(`❌ Delete`)
			.setStyle(`SECONDARY`)
	);

	const message = await interaction.channel.send({
		embeds: [embed],
		components: [buttons],
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
