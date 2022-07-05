const db = require('../connection');
const format = require('pg-format');

const seed = (data) => {
	const { potsData, userData } = data;
	return db
		.query(`DROP TABLE IF EXISTS pots, users;`)
		.then(() => {
			return db.query(`CREATE TABLE users(
			user_id SERIAL PRIMARY KEY,
			username VARCHAR NOT NULL,
			name VARCHAR NOT NULL,
			avatar_url VARCHAR,
			password VARCHAR NOT NULL
			);`);
		})
		.then(() => {
			return db.query(`CREATE TABLE pots(
			pot_id SERIAL PRIMARY KEY,
			pot_name VARCHAR NOT NULL,
			owner_id INT NOT NULL REFERENCES users(user_id),
			notes VARCHAR,
			goal INT NOT NULL,
			starting_value INT NOT NULL,
			current_value INT NOT NULL
		);`);
		})
		.then(() => {
			const usersQuery = format(
				`INSERT INTO users (username, name, avatar_url, password) VALUES %L RETURNING *;`,
				userData.map((list) => {
					return [
						list.username,
						list.name,
						list.avatar_url,
						list.password,
					];
				})
			);
			return db.query(usersQuery);
		})
		.then(() => {
			const potsQuery = format(
				`INSERT INTO pots (pot_name, owner_id, notes, goal, starting_value, current_value) VALUES
				%L
				RETURNING *;`,
				potsData.map((list) => {
					return [
						list.pot_name,
						list.owner_id,
						list.notes,
						list.goal,
						list.starting_value,
						list.current_value,
					];
				})
			);
			return db.query(potsQuery);
		})
		.catch((err) => {
			console.log(err);
		});
};

module.exports = seed;
