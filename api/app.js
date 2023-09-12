const express = require("express");
const fs = require("fs");

const cors = require("cors");
const morgan = require("morgan");

const logger = require('./utils/logger');
const AppError = require('./utils/appError');

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

app.use(express.json());

const countries = JSON.parse(fs.readFileSync(`${__dirname}/data/countries.json`, 'utf-8'));

app.post('/api/v1/auth/signup', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: "Register account successfully"
  });
});

app.post('/api/v1/auth/login', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: "Login successfully", 
    data: req.body.data
  });
});

app.get('/api/v1/resources/countries', (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      countries
    }
  });
});

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

module.exports = app;