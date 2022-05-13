// >> Modules
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
require('dotenv').config();

// >> Imports
const verify = require('./../../embeds/verify.js');
const rules = require('./../../embeds/rules.js');
const faq = require('./../../embeds/faq.js');
const howtogetwl = require('./../../embeds/howtogetwl.js');
const officiallinks = require('./../../embeds/officiallinks.js');
const bigbrain = require('../../embeds/bigbrain.js');
const gamer = require('../../embeds/gamer.js');
const security = require('../../embeds/security.js');
const newtoterra = require('../../embeds/newtoterra.js');
const roles = require('../../embeds/roles.js');
const soon = require('../../embeds/soon.js');
const commands = require('../../embeds/commands.js');
const readycomp = require('../../embeds/readycomp.js');
const ogwl = require('../../embeds/ogwl.js');
const freecoconuts = require('../../embeds/freecoconuts.js');
const shop = require('../../embeds/shop.js');
const tasks = require('../../embeds/tasks.js');
const raffles = require('../../embeds/raffles.js');

// >> Function
module.exports = {
	data: new SlashCommandBuilder()
		.setName('embed')
		.setDescription('📛 Send embed message (admin)')
		.addStringOption((option) =>
			option
				.setName('embedname')
				.setRequired(true)
				.setDescription("The embed name you'd like to send (admin)")
				.addChoice('verifier', 'verifier')
				.addChoice('rules', 'rules')
				.addChoice('faq', 'faq')
				.addChoice('howtogetwl', 'howtogetwl')
				.addChoice('officiallinks', 'officiallinks')
				.addChoice('bigbrain', 'bigbrain')
				.addChoice('security', 'security')
				.addChoice('newtoterra', 'newtoterra')
				.addChoice('roles', 'roles')
				.addChoice('soon', 'soon')
				.addChoice('commands', 'commands')
				.addChoice('readycomp', 'readycomp')
				.addChoice('ogwl', 'ogwl')
				.addChoice('freecoconuts', 'freecoconuts')
				.addChoice('shop', 'shop')
				.addChoice('tasks', 'tasks')
				.addChoice('raffles', 'raffles')
		),
	async execute(interaction, client) {
		if (
			interaction.member.roles.cache.some(
				(role) => role.id === process.env.privateAdminRole
			)
		) {
			let send = false;
			if (interaction.options.getString('embedname') === 'verifier') {
				verify.sendEmbed(interaction, client);
				send = true;
			} else if (interaction.options.getString('embedname') === 'rules') {
				rules.sendEmbed(interaction, client);
				send = true;
			} else if (interaction.options.getString('embedname') === 'faq') {
				faq.sendEmbed(interaction, client);
				send = true;
			} else if (
				interaction.options.getString('embedname') === 'howtogetwl'
			) {
				howtogetwl.sendEmbed(interaction, client);
				send = true;
			} else if (
				interaction.options.getString('embedname') === 'officiallinks'
			) {
				officiallinks.sendEmbed(interaction, client);
				send = true;
			} else if (
				interaction.options.getString('embedname') === 'bigbrain'
			) {
				bigbrain.sendEmbed(interaction, client);
				send = true;
			} else if (interaction.options.getString('embedname') === 'gamer') {
				gamer.sendEmbed(interaction, client);
				send = true;
			} else if (
				interaction.options.getString('embedname') === 'security'
			) {
				security.sendEmbed(interaction, client);
				send = true;
			} else if (
				interaction.options.getString('embedname') === 'newtoterra'
			) {
				newtoterra.sendEmbed(interaction, client);
				send = true;
			} else if (interaction.options.getString('embedname') === 'roles') {
				roles.sendEmbed(interaction, client);
				send = true;
			} else if (interaction.options.getString('embedname') === 'soon') {
				soon.sendEmbed(interaction, client);
				send = true;
			} else if (
				interaction.options.getString('embedname') === 'commands'
			) {
				commands.sendEmbed(interaction, client);
				send = true;
			} else if (
				interaction.options.getString('embedname') === 'readycomp'
			) {
				readycomp.sendEmbed(interaction, client);
				send = true;
			} else if (interaction.options.getString('embedname') === 'ogwl') {
				ogwl.sendEmbed(interaction, client);
				send = true;
			} else if (
				interaction.options.getString('embedname') === 'freecoconuts'
			) {
				freecoconuts.sendEmbed(interaction, client);
				send = true;
			} else if (interaction.options.getString('embedname') === 'shop') {
				shop.sendEmbed(interaction, client);
				send = true;
			} else if (interaction.options.getString('embedname') === 'tasks') {
				tasks.sendEmbed(interaction, client);
				send = true;
			} else if (
				interaction.options.getString('embedname') === 'raffles'
			) {
				raffles.sendEmbed(interaction, client);
				send = true;
			}

			if (send === true) {
				//Reply embed creation
				const replyEmbed = new MessageEmbed()
					.setColor(process.env.command_success_color)
					.setTitle(process.env.command_success_title)
					.setDescription(process.env.command_success_desc)
					.setTimestamp()
					.setFooter({
						text: interaction.member.user.username,
						iconURL: interaction.member.user.displayAvatarURL(),
					});

				//Reply
				await interaction.reply({
					embeds: [replyEmbed],
					ephemeral: true,
				});
			} else {
				//Reply embed creation
				const replyEmbed = new MessageEmbed()
					.setColor('#4295f5')
					.setTitle('Error!')
					.setDescription('Wrong embed name!')
					.setTimestamp()
					.setFooter({
						text: interaction.member.user.username,
						iconURL: interaction.member.user.displayAvatarURL(),
					});

				//Reply
				await interaction.reply({
					embeds: [replyEmbed],
					ephemeral: true,
				});
			}
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
