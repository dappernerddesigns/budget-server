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

exports.patchUser = (username, name, avatar_url, password, user_id) => {
	if (!username || !name || !avatar_url || !password || !user_id) {
		return Promise.reject({ status: 400, msg: 'Invalid Input' });
	}
	return db
		.query(
			'UPDATE users SET username = $1, name = $2, avatar_url=$3, password=$4 WHERE user_id = user_id RETURNING *',
			[username, name, avatar_url, password]
		)
		.then(({ rows }) => {
			console.log(rows);
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
			if (rows.length === 0) {
				console.log('in reject');
				Promise.reject({
					status: 404,
					msg: 'No pots for this user',
				});
			}
			return rows;
		});
};
