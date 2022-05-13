// >> Modules
require('dotenv').config();
const { MessageEmbed } = require('discord.js');

// >> Imports
const dbCon = require('../../dbConnect.js');

// >> Variables
let embedName = 'HowToGetWL';

// >> Main function
async function sendEmbed(interaction, client) {
	//Embed creation
	const embed = new MessageEmbed()
		.setColor('#ffda1f')
		.setAuthor({
			name: 'How to get whitelisted?',
			iconURL: 'https://i.imgur.com/0aTfRnD.png',
		})
		.setDescription(
			'1️⃣ Stay active and chat with others in <#952592856751673473>. Start creative conversations and engage with the community. The team will be choosing the most active people. Everyone has a chance!\n\n2️⃣ Possessing a higher level increases your chance of getting a WL spot. You can earn XP by chatting with others and taking part in our Games & Quizzes (details will be revealed soon).\n\n3️⃣ Interact with our tweets. Retweet, like & comment our posts. (You can post screenshot in <#956210927647219823>).\n\n4️⃣ You can get a WL spot by winning one of our weekly Season Games & future Quizzes.'
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
