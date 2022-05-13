// >> Modules
require('dotenv').config();

// >> Imports
const invitesFunctions = require('../otherFunctions/invitesFunctions.js');

// >> Functions
module.exports = {
	name: 'guildMemberRemove',
	async execute(member) {
		invitesFunctions.deleteMember(member);
	},
};
