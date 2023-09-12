const mongoose = require('mongoose');
const dotenv = require('dotenv');

const terminate = require('./utils/terminate');
const logger = require('./utils/logger');

if (process.env.NODE_ENV !== 'production') {
	dotenv.config({ path: '.env' });
}

process.on('uncaughtException', err => {
	console.error('UNHANDLER EXCEPTION! 💥 Shutting down...');
	console.error(`${err.name}: ${err.message}`);
	process.exit(1);
});

const app = require('./app');
const AppError = require('./utils/appError');

const DB = process.env.DATABASE.replace(
	'<PASSWORD>',
	process.env.DATABASE_PASSWORD
)

mongoose
	?.connect(DB)
	.then(() => logger.success("Connect to MongoDB successfully"))
	.catch((err) => {
		console.log(err);
		throw new AppError("Disconnect to MongoDB", 500)
	});
	
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
	logger.success(`App running on port ${port}`);
});

const exitHandler = terminate(server, {
	coredump: false,
	timeout: 500
});

process.on(
	'unhandledRejection',
	exitHandler(1, 'UNHANDLER REJECTION! 💥 Shutting down...')
);

/* --- SIGNAL HANDLER --- */
process.on('SIGTERM', exitHandler(0, 'SIGTERM'));
process.on('SIGINT', exitHandler(0, 'SIGINT'));