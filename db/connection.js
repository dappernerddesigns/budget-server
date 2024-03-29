const { Pool } = require('pg');
const ENV = process.env.NODE_ENV || 'dev';

require('dotenv').config({
	path: `${__dirname}/../.env.${ENV}`,
});
console.log(`**Running in ${ENV} ENV**`);

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
	throw new Error('PGDATABASE not set, or DATABASE_URL not set');
}

const config =
	ENV === 'production'
		? {
				connectionString: process.env.DATABASE_URL,
				ssl: {
					rejectUnauthorized: false,
				},
		  }
		: {};

module.exports = new Pool(config);
