// >> Modules
require('dotenv').config();

// >> Variables
let upTimeTimer = 1000 * 60; // 1 minute
let days = 0;
let hours = 0;
let minutes = 0;
let globalClient;

// >> Main function
function mainFunction(client) {
	console.log(`[BOT]: Uptime functions loaded!`);
	globalClient = client;

	function changeValuesTime() {
		minutes = minutes + 1;
		while (minutes >= 60) {
			minutes = minutes - 60;
			hours = hours + 1;
		}
		while (hours >= 24) {
			hours = hours - 24;
			days = days + 1;
		}
		uptimeEdit();
	}

	function uptimeEdit() {
		if (days > 0) {
			globalClient.user.setActivity(
				'Uptime: ' + days + 'd, ' + hours + 'h, ' + minutes + 'm',
				{
					type: 'LISTENING',
				}
			);
		} else {
			globalClient.user.setActivity(
				'Uptime: ' + hours + 'h, ' + minutes + 'm',
				{
					type: 'LISTENING',
				}
			);
		}
	}
	changeValuesTime();

	setInterval(function () {
		changeValuesTime();
	}, upTimeTimer);
}

module.exports = { mainFunction };
