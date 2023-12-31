const AppError = require("../utils/appError");
const logger = require("../utils/logger");

// Invalid MongoDB IDs
const handleCastErrorDB = err => {
	const message = `Invalid ${err.path}: ${err.value}.`;
	return new AppError(message, 400);
}

const handleDuplicateFieldsDB = err => {
	const message = `Duplicate field value: ${err?.keyValue?.name}. Please use another value !`;
	return new AppError(message, 400);
}

/* 
	An error occurs when the data sent to the server does not match 
	the definitions in the schema.
*/
const handleValidationErrorDB = err => {
	return new AppError(err.message, 400);
}

const handleJWTError = () => new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () => new AppError('Your token has expired! Please log in again.', 401);

const handleLimitImageSize = () => new AppError('Image size cannot be larger than 5MB.', 500);

const sendErrorDev = (err, res) => {
	res.status(err.statusCode).json({
		status: err.status,
		error: err,
		message: err.message,
		stack: err.stack
	});
}

const sendErrorProd = (err, res) => {
	// Operational, trusted error: send message to client
	if (err.isOperational) {
		res.status(err.statusCode).json({
			status: err.status,
			message: err.message
		});
	}
	// Programming or other unknown error: don't leak error details
	else {
		// 1) Log error
		logger.error(`Error 💥: ${err.message}`);

		// 2) Send generic message
		res.status(500).json({
			status: 'error',
			message: 'Something went very wrong!'
		});
	}
}

module.exports = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || 'error'

	if (process.env.NODE_ENV === 'development') {
		sendErrorDev(err, res);
	}
	else if (process.env.NODE_ENV === 'production') {
		// Because err comes from middleware, we shouldn't change err variable
		// -> create new variable(hard-copy of error object)
		let error = JSON.parse(JSON.stringify(err));

		// we will pass the error that mongo created into these function and return new error
		// that is instance of AppError class and that error then will be marked as operational
		if (error.name === 'CastError') error = handleCastErrorDB(error);
		if (error.code === 11000) error = handleDuplicateFieldsDB(error);
		if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
		if (error.name === 'JsonWebTokenError') error = handleJWTError();
		if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
		if (error.code === 'LIMIT_FILE_SIZE') error = handleLimitImageSize();

		sendErrorProd(error, res);
	}
}
