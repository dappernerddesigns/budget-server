const apiRouter = require('express').Router();
const userRouter = require('./user.router');

apiRouter.get('/', (req, res) => {
	res.status(200).send({ msg: 'Server running ok' });
});

apiRouter.use('/users', userRouter);

module.exports = apiRouter;
