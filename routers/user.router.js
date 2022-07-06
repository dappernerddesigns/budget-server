const userRouter = require('express').Router();
const {
	getAllUsers,
	getUser,
	addUser,
	updateUser,
	getAllPots,
	addPot,
	updatePot,
} = require('../controllers/user.controller');

userRouter.route('/').get(getAllUsers);
userRouter.route('/:user_id').get(getUser);
userRouter.route('/').post(addUser);
userRouter.route('/:user_id').patch(updateUser);
userRouter.route('/:user_id/pots').get(getAllPots);
// userRouter.route('/:user_id/pots').post(addPot);
// userRouter.route('/:user_id/pots').patch(updatePot);
module.exports = userRouter;
