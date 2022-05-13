// >> Modules
require('dotenv').config();

// >> Imports
const invitesFunctions = require('./../otherFunctions/invitesFunctions.js');

// >> Functions
module.exports = {
	name: 'inviteCreate',
	async execute(invite) {
		invitesFunctions.newInvite(invite);
	},
};
