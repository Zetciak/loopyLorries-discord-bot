// >> Modules
require('dotenv').config();

// >> Functions
module.exports = {
	name: 'interactionCreate',
	async execute(interaction, client) {
		if (interaction.isCommand()) {
			//COMMAND
			const command = client.commands.get(interaction.commandName);

			if (!command) return;

			try {
				await command.execute(interaction, client);
			} catch (error) {
				console.error(error);
				await interaction.reply({
					content: 'There was an error while executing this command!',
					ephemeral: true,
				});
			}
		} else if (interaction.isButton) {
			const button = client.buttons.get(interaction.customId);
			if (!button)
				return await interaction.reply({
					content: 'Theres no button code for this button',
					ephemeral: true,
				});

			try {
				await button.execute(interaction, client);
			} catch (error) {
				console.error(error);
				await interaction.reply({
					content: 'There was an error while executing this button!',
					ephemeral: true,
				});
			}
		}
	},
};
