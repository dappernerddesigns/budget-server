exports.handleCustomErrors = (err, req, res, next) => {
	if (err.status && err.msg) {
		res.status(err.status).send({ msg: err.msg });
	} else next(err);
};

exports.handlePsqlErrors = (err, req, res, next) => {
	if (err.code === '22P02') {
		res.status(400).send({ msg: 'Invalid Input' });
	} else next(err);
};

exports.catchAllErrors = (err, req, res, next) => {
	res.status(404).send({
		msg: "Whatever you were looking for, it isn't here",
	});
};

exports.handleServerErrors = (err, req, res, next) => {
	console.log(err);
	res.status(500).send({ msg: 'Internal Server Error' });
};
