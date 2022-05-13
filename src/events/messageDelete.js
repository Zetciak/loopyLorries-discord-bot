// >> Modules
require('dotenv').config();

// >> Imports
const dbCon = require('../../dbConnect.js');
const expCounter = require('../otherFunctions/expCounter.js');

// >> Functions
module.exports = {
	name: 'messageDelete',
	async execute(message, client) {
		if (message.author.bot === false) {
			//Database querry
			dbCon.query(
				`SELECT deletedMessages FROM lp_users WHERE user_id='${message.author.id}'`,
				async function (err, result, fields) {
					if (err) {
						console.log(err);
					} else {
						if (result.length > 0) {
							let messages =
								Number(result[0].deletedMessages) + 1;
							dbCon.query(
								`UPDATE lp_users SET deletedMessages='${messages}' WHERE user_id='${message.author.id}'`,
								async function () {}
							);
						}
					}
				}
			);

			//Insert into deleted
			dbCon.query(
				`INSERT INTO lp_deleted_messages (author_id, author_name, content) VALUES ('${message.author.id}', '${message.author.username}', '${message.content}')`,
				async function (err, result, fields) {}
			);
		}
	},
};
