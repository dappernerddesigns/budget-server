const {
	fetchAllUsers,
	fetchUser,
	postUser,
	patchUser,
	fetchUserPots,
	createPot,
	patchPot,
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
	const column = Object.keys(req.body)[0];
	const data = Object.values(req.body)[0];

	patchUser(user_id, column, data)
		.then((response) => {
			res.status(200).send({ user: response });
		})
		.catch(next);
};

exports.getAllPots = (req, res, next) => {
	const { user_id } = req.params;
	fetchUserPots(user_id).then((response) => {
		res.status(200).send({ pots: response });
	});
};

exports.addPot = (req, res, next) => {
	const { user_id } = req.params;
	const { pot_name, owner_id, notes, goal, starting_value, current_value } =
		req.body;
	createPot(
		user_id,
		pot_name,
		owner_id,
		notes,
		goal,
		starting_value,
		current_value
	)
		.then((response) => {
			res.status(201).send({ pot: response });
		})
		.catch(next);
};

exports.updatePot = (req, res, next) => {
	const { pot_id } = req.params;
	const column = Object.keys(req.body)[0];
	const data = Object.values(req.body)[0];
	patchPot(pot_id, column, data).then((response) => {
		res.status(200).send({ pot: response });
	});
};
