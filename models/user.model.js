const db = require('../db/connection');

exports.fetchAllUsers = () => {
	return db.query('SELECT * FROM users;').then(({ rows }) => {
		return rows;
	});
};

exports.fetchUser = (user_id) => {
	return db
		.query('SELECT * FROM users WHERE user_id = $1', [user_id])
		.then(({ rows }) => {
			if (rows.length === 0) {
				return Promise.reject({
					status: 404,
					msg: 'User not found in database',
				});
			}
			return rows[0];
		});
};

exports.postUser = (username, name, avatar_url, password) => {
	if (!username || !name || !avatar_url || !password) {
		return Promise.reject({ status: 400, msg: 'Invalid Input' });
	}
	return db
		.query(
			'INSERT INTO users (username, name, avatar_url, password)VALUES ($1,$2,$3,$4) RETURNING *;',
			[username, name, avatar_url, password]
		)
		.then(({ rows }) => {
			return rows[0];
		});
};

exports.patchUser = (user_id, column, data) => {
	if (!user_id || !column || !data) {
		return Promise.reject({ status: 400, msg: 'Invalid Input' });
	}

	return db
		.query(
			`UPDATE users SET ${column} = $1 WHERE user_id = $2 RETURNING *`,
			[data, user_id]
		)
		.then(({ rows }) => {
			if (rows.length === 0) {
				return Promise.reject({ status: 404, msg: 'User not found' });
			}
			return rows[0];
		});
};

exports.fetchUserPots = (user_id) => {
	return db
		.query('SELECT * FROM pots WHERE owner_id = $1', [user_id])
		.then(({ rows }) => {
			return rows;
		});
};

exports.createPot = (
	user_id,
	pot_name,
	owner_id,
	notes,
	goal,
	starting_value,
	current_value
) => {
	if (
		!user_id ||
		!pot_name ||
		!owner_id ||
		!goal ||
		!starting_value ||
		!current_value
	) {
		return Promise.reject({ status: 400, msg: 'Invalid Input' });
	}
	return db
		.query(
			'INSERT INTO pots (pot_name, owner_id, notes, goal, starting_value, current_value)VALUES ($1,$2,$3,$4, $5, $6) RETURNING *;',
			[pot_name, owner_id, notes, goal, starting_value, current_value]
		)
		.then(({ rows }) => {
			return rows[0];
		});
};

exports.patchPot = (pot_id, column, dataToUpdate) => {
	return db
		.query(`UPDATE pots SET ${column}=$1 WHERE pot_id=$2 RETURNING *`, [
			dataToUpdate,
			pot_id,
		])
		.then(({ rows }) => {
			return rows[0];
		});
};
