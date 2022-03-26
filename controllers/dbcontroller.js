const mysql = require('mysql');
require('dotenv').config();

var conn = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD || '',
	database: process.env.DB_NAME
});

const asyncQuery = (sql) => {
	/**
	 * Asynchronous wrapper function over mysql query method
	 */
	return new Promise((resolve, reject) => {
		conn.query(sql, (err, result) => {
			if (!err) resolve(result);
			else reject(err);
		})
	});
}


module.exports = {
	conn,
	asyncQuery
}