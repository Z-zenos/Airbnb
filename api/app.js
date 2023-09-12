const express = require("express");

const cors = require("cors");
const morgan = require("morgan");

const logger = require('./utils/logger');
const userRouter = require('./routes/user.route');
const resourceRouter = require('./routes/resource.route');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/error.controller');

const app = express();

const morganMiddleware = morgan(
	function (tokens, req, res) {
		return JSON.stringify({
			method: tokens.method(req, res),
			url: tokens.url(req, res),
			status: Number.parseFloat(tokens.status(req, res)),
			content_length: tokens.res(req, res, 'content-length'),
			response_time: Number.parseFloat(tokens['response-time'](req, res)),
		});
	},
	{
		stream: {
			// Configure Morgan to use our custom logger with the http severity
			write: message => logger.http(message),
		},
	}
);


app.use(morganMiddleware);

const corsOptions = {
  origin: "http://localhost:5173",
  credetials: true
}

app.use(cors(corsOptions));
app.disable('x-powered-by');

app.use(express.json());

app.use('/api/v1/auth', userRouter);
app.use('/api/v1/resources', resourceRouter);

app.get('/_health', (req, res) => {
  res.status(200).json({
    message: "Api is very ok!",
    status: 'success'
  });
});

// Handling Unhandled Routes
app.all('*', (req, res, next) => {
	next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;