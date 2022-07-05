const {
	fetchAllUsers,
	fetchUser,
	postUser,
	patchUser,
} = require('../models/user.model');

exports.getAllUsers = (req, res, next) => {
	fetchAllUsers()
		.then((response) => {
			res.status(200).send({ users: response });
		})
		.catch(next);
};

exports.getUser = (req, res, next) => {
	const { user_id } = req.params;
	fetchUser(user_id)
		.then((response) => {
			res.status(200).send({ user: response });
		})
		.catch(next);
};

exports.addUser = (req, res, next) => {
	const { username, name, avatar_url, password } = req.body;
	postUser(username, name, avatar_url, password)
		.then((response) => {
			res.status(201).send({ user: response });
		})
		.catch(next);
};

exports.updateUser = (req, res, next) => {
	const { user_id } = req.params;
	console.log(req.body);
	const column = Object.keys(req.body);
	console.log(column);
	patchUser()
		.then((response) => {
			res.status(200).send({ user: response });
		})
		.catch(next);
};
