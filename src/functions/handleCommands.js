const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');

module.exports = (client) => {
	client.handleCommands = async (commandsFolders, path) => {
		client.commandArray = [];
		for (folder of commandsFolders) {
			const commandFiles = fs
				.readdirSync(`${path}/${folder}`)
				.filter((file) => file.endsWith('.js'));
			for (const file of commandFiles) {
				const command = require(`../commands/${folder}/${file}`);

				client.commands.set(command.data.name, command);
				client.commandArray.push(command.data.toJSON());
			}
		}

		const rest = new REST({
			version: '9',
		}).setToken(process.env.botToken);

		(async () => {
			try {
				console.log(
					`[BOT]: Started refreshing application (/) commands.`
				);

				await rest.put(
					Routes.applicationGuildCommands(
						process.env.clientId,
						process.env.serverId
					),
					{
						body: client.commandArray,
					}
				);

				console.log(
					`[BOT]: Successfully reloaded application (/) commands.`
				);
			} catch (error) {
				console.log(error);
			}
		})();
	};
};
