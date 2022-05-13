// >> Modules
require('dotenv').config();
const { MessageEmbed } = require('discord.js');

// >> Imports
const dbCon = require('../../dbConnect.js');

// >> Variables
let embedName = 'CoconutShop';

// >> Main function
async function sendEmbed(interaction, client) {
	//Embed creation
	const embed = new MessageEmbed()
		.setColor('#d1d1d1')
		.setTitle('🥥⠀Shop')
		.setDescription(
			`With coconuts, you can buy entries to special giveaways with NFT, WL prizes, and other valuable things. You can also buy additional things from the shop if you don’t want to save your coconuts for the Coconut Giveaway.\n\n**5 🥥** - 1 entry to a Coconut Giveaway (no entry limit)\n**100 🥥** - Whitelist Spot\n**200 🥥** - Coconut role\n**X 🥥** - Free NFT\n**X 🥥** - [REDACTED]\n\n(Buying entries to giveaways will be available in <#954446622140547122> 2 days before every Coconut Giveaway). The more entries you’ve bought the higher your chance of winning you have. There will be a giveaway every 1-2 weeks. Please create a ticket if you want to buy a WL or Coconut Role with coconuts.`
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
