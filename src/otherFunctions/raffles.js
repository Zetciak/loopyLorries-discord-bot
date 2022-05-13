// >> Modules
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
require('dotenv').config();

// >> Imports
const dbCon = require('../../dbConnect.js');

// >> Variables
let globalClient;
let activeRaffles = new Array();

// >> Main function
function mainFunction(client) {
	console.log(`[BOT]: Raffles functions loaded!`);
	globalClient = client;

	dbCon.query(
		`SELECT * FROM lp_contests WHERE ended='0'`,
		async function (err, result, fields) {
			if (err) {
				console.log(err);
			} else {
				for (let i = 0; i < result.length; i++) {
					addRaffle(
						result[i].messageId,
						result[i].channelId,
						Number(result[i].ended),
						Number(result[i].endTimestamp),
						Number(result[i].price),
						result[i].prize,
						Number(result[i].winners)
					);
				}
			}
		}
	);
}

// >> Adding raffle function
function addRaffle(
	messageId,
	channelId,
	ended,
	endTimestamp,
	price,
	prize,
	winners
) {
	activeRaffles[messageId] = {
		channelId: channelId,
		ended: ended,
		endTimestamp: endTimestamp,
		messageId: messageId,
		price: price,
		prize: prize,
		winners: winners,
	};
	setInterval(function () {
		for (const [key, value] of Object.entries(activeRaffles)) {
			checkEnded(key, value);
		}
	}, (Number(endTimestamp) - Number((Date.now() / 1000).toFixed(0))) * 1000);
}

// >> Joining raffle function
async function joinRaffle(interaction) {
	if (activeRaffles[interaction.message.id]) {
		let user = interaction.member.user;
		let member = interaction.member;
		let raffle = activeRaffles[interaction.message.id];

		dbCon.query(
			`SELECT * FROM lp_users WHERE user_id='${user.id}' LIMIT 1`,
			async function (err, result, fields) {
				if (err) {
					console.log(err);
				} else {
					if (result.length > 0) {
						let tickets = Number(result[0].tickets);
						if (tickets >= raffle.price) {
							// Remove tickets
							dbCon.query(
								`UPDATE lp_users SET tickets=tickets-${raffle.price} WHERE user_id='${user.id}'`,
								async function (err2, result2, fields2) {
									if (err2) {
										console.log(err2);
									} else {
									}
								}
							);

							// Add to raffle
							dbCon.query(
								`INSERT INTO lp_contests_joins (raffleId, memberId) VALUES ('${raffle.messageId}', '${user.id}')`,
								async function (err2, result2, fields2) {
									if (err2) {
										console.log(err2);
									} else {
									}
								}
							);

							// Reply embed creation
							const replyEmbed = new MessageEmbed()
								.setColor('#4ceb34')
								.setTitle('Success!')
								.setDescription(
									`Entered the raffle correctly!\n\`${raffle.price} 🥥\` has been taken from your account.`
								)
								.setFooter({
									text: interaction.member.user.username,
									iconURL:
										interaction.member.user.displayAvatarURL(),
								});

							await interaction.reply({
								embeds: [replyEmbed],
								ephemeral: true,
							});

							// Getting channel and message
							let channel = await globalClient.channels.fetch(
								raffle.channelId
							);
							let message = await channel.messages.fetch(
								raffle.messageId
							);

							// Raffling functions
							dbCon.query(
								`SELECT * FROM lp_contests_joins WHERE raffleId='${raffle.messageId}'`,
								async function (err, result3, fields) {
									if (err) {
										console.log(err);
									} else {
										// Edit message
										const raffleEmbed = new MessageEmbed()
											.setColor('#d1d1d1')
											.setTitle('🥥 RAFFLE 🥥')
											.setDescription(
												`**Raffle prize:**\n${raffle.prize}\n**Raffle price:** ${raffle.price} 🥥 = 1 🎟️\n**Ends:** <t:${raffle.endTimestamp}:R> (<t:${raffle.endTimestamp}:f>)\n`
											)
											.addFields({
												name: 'Tickets in the pool:',
												value: `🎟️ ${result3.length}`,
											});
										if (message) {
											message.edit({
												embeds: [raffleEmbed],
											});
										}
									}
								}
							);
						} else {
							// Reply embed creation
							const replyEmbed = new MessageEmbed()
								.setColor('#ff4242')
								.setTitle('Oops!')
								.setDescription(
									`You can't afford to participate!\nNeeded: \`${raffle.price} 🥥\`, owned: \`${tickets} 🥥\``
								)
								.setFooter({
									text: interaction.member.user.username,
									iconURL:
										interaction.member.user.displayAvatarURL(),
								});

							await interaction.reply({
								embeds: [replyEmbed],
								ephemeral: true,
							});
						}
					}
				}
			}
		);
	}
}

// >> Checking ended raffles
async function checkEnded(key, value) {
	if (value.ended === 0) {
		if (value.endTimestamp <= Number((Date.now() / 1000).toFixed(0))) {
			// Raffle ended!
			// Update ended to 1
			value.ended = 1;
			dbCon.query(
				`UPDATE lp_contests SET ended=1 WHERE messageId='${key}'`,
				async function (err2, result2, fields2) {
					if (err2) {
						console.log(err2);
					} else {
					}
				}
			);

			// Getting channel and message
			let channel = await globalClient.channels.fetch(value.channelId);
			let message = await channel.messages.fetch(value.messageId);

			// Raffling functions
			dbCon.query(
				`SELECT * FROM lp_contests_joins WHERE raffleId='${key}'`,
				async function (err, result, fields) {
					if (err) {
						console.log(err);
					} else {
						let winners = ``;
						if (result.length > 0) {
							for (let ii = 0; ii < value.winners; ii++) {
								winners =
									winners +
									`${ii + 1}. <@${
										result[getRandomInt(0, result.length)]
											.memberId
									}>\n`;
							}
						} else {
							winners = '❌ Nobody took part!';
						}

						// Edit message
						const replyEmbed = new MessageEmbed()
							.setColor('#d1d1d1')
							.setTitle('🥥 RAFFLE ENDED 🥥')
							.addFields(
								{
									name: 'Raffle prize:',
									value: `${value.prize}`,
								},
								{
									name: 'Winners:',
									value: `${winners}`,
								}
							);

						// Edit message
						const raffleEmbed = new MessageEmbed()
							.setColor('#d1d1d1')
							.setTitle('🥥 RAFFLE 🥥')
							.setDescription(
								`**Raffle prize:**\n${value.prize}\n**Raffle price:** ${value.price} 🥥 = 1 🎟️\n**Ends:** <t:${value.endTimestamp}:R> (<t:${value.endTimestamp}:f>)\n`
							)
							.addFields(
								{
									name: 'Tickets in the pool:',
									value: `🎟️ ${result.length}`,
								},
								{
									name: 'Status:',
									value: `❌ Raffle ended`,
								},
								{
									name: 'Winners:',
									value: `${winners}`,
								}
							);

						//Button creation
						const raffleButtons =
							new MessageActionRow().addComponents(
								new MessageButton()
									.setCustomId(`raffleEnded`)
									.setLabel(`❌`)
									.setStyle(`SECONDARY`)
							);
						if (message) {
							message.edit({
								embeds: [raffleEmbed],
								components: [raffleButtons],
							});

							message.reply({
								embeds: [replyEmbed],
							});
						}
					}
				}
			);

			dbCon.query(
				`DELETE FROM lp_contests_joins WHERE raffleId='${key}'`,
				async function (err, result, fields) {}
			);

			dbCon.query(
				`DELETE FROM lp_contests WHERE messageId='${key}'`,
				async function (err, result, fields) {}
			);
		}
	}
}

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = { mainFunction, addRaffle, joinRaffle };
