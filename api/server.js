

process.on('uncaughtException', err => {
	console.error('UNHANDLER EXCEPTION! 💥 Shutting down...');
	console.error(`${err.name}: ${err.message}`);
	process.exit(1);
});

const app = require('./app');

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});