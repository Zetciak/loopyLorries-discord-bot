// >> Modules
require('dotenv').config();
const { MessageEmbed } = require('discord.js');

// >> Imports
const dbCon = require('../../dbConnect.js');

// >> Variables
let embedName = 'security';

// >> Main function
async function sendEmbed(interaction, client) {
	//Embed creation
	const embed = new MessageEmbed()
		.setColor('#f7c625')
		.setAuthor({
			name: 'How to be safe in the web3 space?',
			iconURL: 'https://i.imgur.com/eHXLlCe.png',
		})
		.setDescription(
			"1️⃣ Use ONLY official link from <#952592856751673464>.\n\n2️⃣ Don't click on ANY links from private messages (WE WILL NEVER DM YOU FIRST).\n\n3️⃣ Block receiving messages on Discord.\n\n4️⃣ When you see someone impersonating us, please create a ticket and let us know (<#952592857557004342>).\n\n5️⃣ Be careful with website mirrors. ALWAYS double check domains before signing Hashes."
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
