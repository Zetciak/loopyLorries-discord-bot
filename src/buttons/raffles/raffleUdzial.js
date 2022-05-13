// >> Modules
const { MessageEmbed } = require('discord.js');
require('dotenv').config();
const raffles = require('./../../otherFunctions/raffles.js');

// >> Function
module.exports = {
	data: {
		name: `raffleUdzial`,
	},
	async execute(interaction, client) {
		raffles.joinRaffle(interaction);
	},
};
