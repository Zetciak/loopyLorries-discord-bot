// >> Modules
require('dotenv').config();

// >> Imports
const dbCon = require('../../dbConnect.js');
const expCounter = require('./../otherFunctions/expCounter.js');
const ssProof = require('./../otherFunctions/ssProof.js');

// >> Functions
module.exports = {
	name: 'messageCreate',
	async execute(message, client) {
		// SS Proof channel
		ssProof.mainFunction(message, client);

		// Message on ss proof
		if (message)
			if (message.author.bot === false) {
				// Message counting
				expCounter.checkExp(message);
				//Database querry
				dbCon.query(
					`SELECT createdMessages FROM lp_users WHERE user_id='${message.author.id}'`,
					async function (err, result, fields) {
						if (err) {
							console.log(err);
						} else {
							if (result.length > 0) {
								let messages =
									Number(result[0].createdMessages) + 1;
								dbCon.query(
									`UPDATE lp_users SET createdMessages='${messages}' WHERE user_id='${message.author.id}'`,
									async function () {}
								);
							}
						}
					}
				);
			}
	},
};
