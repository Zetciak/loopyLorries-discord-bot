// >> Modules
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const ms = require('ms');
require('dotenv').config();

// >> Imports
const dbCon = require('../../../dbConnect.js');
const raffles = require('./../../otherFunctions/raffles.js');

// >> Function
module.exports = {
	data: new SlashCommandBuilder()
		.setName('coconutraffle')
		.setDescription('🥥📛 Create coconut raffle (admin)')
		.addStringOption((option) =>
			option
				.setName('prize')
				.setRequired(true)
				.setDescription('Raffle prize')
		)
		.addNumberOption((option) =>
			option
				.setName('price')
				.setRequired(true)
				.setDescription('Raffle price (🥥 coconuts)')
		)
		.addNumberOption((option) =>
			option
				.setName('duration')
				.setRequired(true)
				.setDescription('Raffle duration')
		)
		.addStringOption((option) =>
			option
				.setName('durationtype')
				.setRequired(true)
				.setDescription(
					'Raffle duration type (m - Minutes, h - Hours, d - Days)'
				)
		)
		.addNumberOption((option) =>
			option
				.setName('winners')
				.setRequired(true)
				.setDescription('Raffle winners count')
		),
	async execute(interaction, client) {
		if (
			interaction.member.roles.cache.some(
				(role) => role.id === process.env.privateAdminRole
			)
		) {
			let prize = interaction.options.getString('prize');
			let price = interaction.options.getNumber('price');
			let duration = interaction.options.getNumber('duration');
			let durationType = interaction.options.getString('durationtype');
			let winners = interaction.options.getNumber('winners');

			let nowTimestamp = Number((Date.now() / 1000).toFixed(0));
			let addTimestamp = Number(
				(ms(`${duration}${durationType}`) / 1000).toFixed(0)
			);
			let timeStamp = nowTimestamp + addTimestamp;

			//Embed creation
			const raffleEmbed = new MessageEmbed()
				.setColor('#d1d1d1')
				.setTitle('🥥 RAFFLE 🥥')
				.setDescription(
					`**Raffle prize:**\n${prize}\n**Raffle price:** ${price} 🥥 = 1 🎟️\n**Ends:** <t:${timeStamp}:R> (<t:${timeStamp}:f>)\n`
				)
				.addFields({
					name: 'Tickets in the pool:',
					value: '🎟️ 0',
				});

			//Button creation
			const raffleButtons = new MessageActionRow().addComponents(
				new MessageButton()
					.setCustomId(`raffleUdzial`)
					.setLabel(`JOIN (-${price} 🥥)`)
					.setStyle(`SECONDARY`)
			);

			const message = await interaction.channel.send({
				embeds: [raffleEmbed],
				components: [raffleButtons],
			});

			//Embed creation
			const replyEmbed = new MessageEmbed()
				.setColor('#d1d1d1')
				.setTitle('🥥 RAFFLE 🥥')
				.setDescription(`Raffle created!\n`);

			await interaction.reply({
				embeds: [replyEmbed],
				ephemeral: true,
			});

			// Sent raffle into db
			dbCon.query(
				`INSERT INTO lp_contests (channelId, messageId, endTimestamp, prize, price, winners) VALUES ('${message.channelId}', '${message.id}', '${timeStamp}', '${prize}', '${price}', '${winners}')`,
				async function (err2, result2, fields2) {
					if (err2) {
						console.log(err2);
					} else {
					}
				}
			);
			raffles.addRaffle(
				message.id,
				message.channelId,
				0,
				timeStamp,
				price,
				prize,
				winners
			);
		} else {
			//Embed creation
			const embed = new MessageEmbed()
				.setColor(process.env.command_permissions_error_color)
				.setTitle(process.env.command_permissions_error_title)
				.setDescription(process.env.command_permissions_error_desc)
				.setTimestamp()
				.setFooter({
					text: interaction.member.user.username,
					iconURL: interaction.member.user.displayAvatarURL(),
				});

			//Reply
			await interaction.reply({
				embeds: [embed],
				ephemeral: true,
			});
		}
	},
};
