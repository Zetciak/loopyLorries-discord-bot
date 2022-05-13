// >> Modules
require('dotenv').config();

// >> Imports
const invitesFunctions = require('./../otherFunctions/invitesFunctions.js');

// >> Functions
module.exports = {
	name: 'guildMemberAdd',
	async execute(memberJoin) {
		invitesFunctions.newMember(memberJoin);
	},
};
