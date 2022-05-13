// >> Modules
require('dotenv').config();
const { MessageEmbed } = require('discord.js');

// >> Imports
const dbCon = require('../../dbConnect.js');

// >> Variables
let embedName = 'commands';

// >> Main function
async function sendEmbed(interaction, client) {
	//Embed creation
	const embed = new MessageEmbed()
		.setColor('#428df5')
		.setAuthor({
			name: 'Commands',
			iconURL: 'https://i.imgur.com/mw32M0e.png',
		})
		.addFields(
			{
				name: '/rank',
				value: "Check your or someone else's ranking 🔱.\n⠀",
			},
			{
				name: '/level & /exp',
				value: "Check your or someone else's level and exp 🔱.\n⠀",
			},
			{
				name: '/top & /leaderboard',
				value: `Check top (3-20) users by ranking 🔱.\n⠀`,
			},
			{
				name: '/invites',
				value: "Check your or someone else's invites count 🔰.\n⠀",
			},
			{
				name: '/topinvites',
				value: `Check top (3-20) users by invites count 🔰.\n⠀`,
			},
			/*{
				name: '/coconuts',
				value: "Check your or someone else's coconuts 🥥.\n⠀",
			},
			{
				name: '/topcoconuts',
				value: `Check top (3-20) users by coconuts count 🥥.\n⠀`,
			},*/
			{
				name: 'More commands soon!',
				value: `You can type all commands on <#${process.env.commandsChannel}>`,
			}
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
