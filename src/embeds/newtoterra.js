// >> Modules
require('dotenv').config();
const { MessageEmbed } = require('discord.js');

// >> Imports
const dbCon = require('../../dbConnect.js');

// >> Variables
let embedName = 'newtoterra';

// >> Main function
async function sendEmbed(interaction, client) {
	//Embed creation
	const embed = new MessageEmbed()
		.setColor('#008cff')
		.setAuthor({
			name: 'New to terra',
			iconURL: 'https://i.imgur.com/cM6MrgU.png',
		})
		.addFields(
			{
				name: '1️⃣ How to create your first Terra wallet?',
				value: '• Download App or Chrome Extension & create your wallet here --> https://station.terra.money/\n⠀',
			},
			{
				name: '2️⃣ How to buy an NFT on Terra?',
				value: "• First you need to deposit funds using exchange like Binance, Crypto.com, Kraken, KuCoin (LUNA or UST).\n• Once you have money on your wallet you can go on one of Terra marketplaces like https://luart.io/ or https://randomearth.io/ .\n• Look for an NFT you like and think it will give you a positive ROI, then buy it. You can sell it anytime, however diamond hands GMI.\n\n**NEVER** solicit sales of NFTs that are not backed by a third party (marketplaces). We don't want you to get scammed.\n\n**IMPORTANT:** Most of the time you have to sell your NFT on a marketplace that you originally purchased on.\n⠀",
			},
			{
				name: '3️⃣ What is the value of an NFT?',
				value: 'While each potential NFT minter will have their own reasoning, there are generally basic value in minting an NFT:\n\n• Democratize ownership: Creating an NFT allows numerous parties to own a stake in the digital asset.\n• Sell unique digital assets: Not only can you trade, buy, or sell stakes in assets, it’s possible that you can have an opportunity to have governance in a DAO.\n• Store and preserve value: You can store the asset’s value in a tangible way — similar to how a physical coin can be minted with a specific precious metal concentration. Plus, preserving value digitally is generally considered safe, thanks to the security of the blockchain and the built-in scarcity of NFTs.\n⠀',
			},
			{
				name: '4️⃣ What is a WL?',
				value: 'Spot on a Whitelist guarantees you participation in the pre-mint phase of the project. Every server has its own rules for giving a WL. Check <#955846367857758288> to see how you can get a WL on our server!\n⠀',
			},
			{
				name: '5️⃣ How to mint an NFT?',
				value: '• Find a project that you think is great Utility, Art, and/or Community. These are staples of all Blue chip projects.\n• Do your own research.\n• Try to get on a Whitelist. The goal is to be early… however this is a fast moving ecosystem you might need to do some tasks to earn a chance to mint on pre-sale. You may try your luck on public mint, however the supply is lower compared to WL and it will sell out like hot cakes.',
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
