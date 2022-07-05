const userRouter = require('express').Router();
const {
	getAllUsers,
	getUser,
	addUser,
	updateUser,
} = require('../controllers/user.controller');

userRouter.route('/').get(getAllUsers);
userRouter.route('/:user_id').get(getUser);
userRouter.route('/').post(addUser);
userRouter.route('/:user_id').patch(updateUser);
module.exports = userRouter;
