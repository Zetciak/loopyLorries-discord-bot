// >> Modules
const Twit = require('twit');
require('dotenv').config();

// >> Variables
let globalClient;
let twitterTimer = 1000 * 60 * 5; // 5 minutes
const Twitter = new Twit({
	consumer_key: process.env.consumer_key,
	consumer_secret: process.env.consumer_secret,
	access_token: process.env.access_token_key,
	access_token_secret: process.env.access_token_secret,
	timeout_ms: 60 * 1000,
	strictSSL: true,
});

// >> Main function
function mainFunction(client) {
	console.log(`[BOT]: Twitter counter functions loaded!`);
	globalClient = client;

	function updateTwitterFollowers() {
		Twitter.get(
			'followers/ids',
			{ screen_name: process.env.twitterCounterName },
			async function (err, data, response) {
				const countChannel = await globalClient.channels.fetch(
					process.env.twitterCounterChannel
				);
				if (countChannel) {
					if (data.ids) {
						countChannel.setName(
							`〔🦥〕Twitter: ${data.ids.length}`
						);
					}
				}
			}
		);
	}
	updateTwitterFollowers();

	setInterval(function () {
		updateTwitterFollowers();
	}, twitterTimer);
}

module.exports = { mainFunction };
