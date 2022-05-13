// >> Modules
require('dotenv').config();
const { MessageEmbed } = require('discord.js');

// >> Imports
const dbCon = require('../../dbConnect.js');

// >> Variables
let embedName = 'Rules';

// >> Main function
async function sendEmbed(interaction, client) {
	//Embed creation
	const embed = new MessageEmbed()
		.setColor('#FF3F41')
		.setAuthor({
			name: 'Rules',
			iconURL: 'https://i.imgur.com/X3Zhl70.png',
		})
		.addFields(
			{
				name: "1. Follow Discord's TOS  🚨",
				value: 'https://discordapp.com/terms\nhttps://discordapp.com/guidelines\n⠀',
			},
			{
				name: '2. Be respectful with all members  ❤️',
				value: 'Be respectful to others. No death threats, sexism, hate speech, racism (NO N WORD, this includes soft N)\nNo doxxing, swatting, witch hunting\n⠀',
			},
			{
				name: '3. No Advertising  🚫',
				value: 'Includes DM advertising. We do not allow advertising here of any kind.\nWe will NEVER DM you asking for any kind of money, do not solicit any suspicious DMs.\nBe sure to check the #4 (i.e. Name#XXXX) at the end of our Discord names.\n⠀',
			},
			{
				name: '4. No NSFW content  🔞',
				value: 'Anything involving gore or sexual content is not allowed.\nNSFW = Not Safe for Work\n⠀',
			},
			{
				name: '5. No spamming in text or VC  ⛔️',
				value: 'Do not spam messages, soundboards, voice changers, or earrape in any channel.\n⠀',
			},
			{
				name: '6. Do not discuss about sensitive topics  👎🏼',
				value: "This isn't a debating server, keep sensitive topics out of here so we don't have a ton of nasty arguments.\n⠀",
			},
			{
				name: '7. No malicious content  🔫',
				value: 'No grabify links, viruses, crash videos, links to viruses, or token grabbers. These will result in an automated ban.\n⠀',
			},
			{
				name: '8. No Self Bots  🤖',
				value: 'Includes all kinds of selfbots: Nitro snipers, selfbots like nighty, auto changing statuses.\n⠀',
			},
			{
				name: '9. Do not DM the staff team  ✉️',
				value: 'Please open a ticket instead in <#952592857557004342>.\n⠀',
			},
			{
				name: '10. Profile Picture / Emoji Rules  🤭',
				value: 'No NSFW allowed.\nNo racism.\nNo brightly flashing pictures to induce an epileptic attack.',
			}
		)
		.setFooter({ text: 'By joining the discord you accept these rules!' });

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
