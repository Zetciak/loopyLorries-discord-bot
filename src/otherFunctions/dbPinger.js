// >> Modules
require('dotenv').config();

// >> Imports
const dbCon = require('../../dbConnect.js');

// >> Variables
let dbPingTimer = 1000 * 30; // 30 seconds
let globalClient;

// >> Main function
function mainFunction(client) {
	console.log(`[BOT]: Database Pinger functions loaded!`);
	globalClient = client;

	function pingDatabase() {
		dbCon.query(
			`SET NAMES 'utf8mb4';`,
			async function (err, result, fields) {}
		);
	}
	pingDatabase();

	setInterval(function () {
		pingDatabase();
	}, dbPingTimer);
}

module.exports = { mainFunction };
