// >> Modules
const mysql = require('mysql');
require('dotenv').config();

// >> Variables
const dbCon = mysql.createConnection({
	host: process.env.dbHost,
	user: process.env.dbUser,
	password: process.env.dbPass,
	database: process.env.dbName,
});

// >> Database connect
dbCon.connect(function (err) {
	if (err) {
		console.log(err);
	} else {
		console.log(`[DB]: Connected to the database! (${process.env.dbName})`);
	}
});

module.exports = dbCon;
