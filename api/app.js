const path = require('path');
const express = require("express");

const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const logger = require('./utils/logger');

const userRouter = require('./routes/user.route');
const amenityRouter = require('./routes/amenity.route');
const authRouter = require('./routes/auth.route');
const imageRouter = require('./routes/image.route');
const resourceRouter = require('./routes/resource.route');
const placeRouter = require('./routes/place.route');

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
	credentials: true,
}

app.use(cors(corsOptions));

app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', 'http://localhost:5173');

	// Request methods you wish to allow
	res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');

	// Request headers you wish to allow
	res.header('Access-Control-Allow-Headers', 'Accept, Content-Type, X-Requested-With', 'X-HTTP-Method-Override');

	// Set to true if you need the website to include cookies in the requests sent
	// to the API (e.g. in case you use sessions)
	res.header('Access-Control-Allow-Credentials', true);
	next();
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, 'resources')));
app.use(express.static(path.join(__dirname, 'public')));

app.disable('x-powered-by');

// Body parser, reading data from body into req.body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/_health', (req, res) => {
	res.status(200).render('confirm_email_changed');
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/places', placeRouter);
app.use('/api/v1/amenities', amenityRouter);
app.use('/api/v1/resources', resourceRouter);
app.use('/api/v1/images', imageRouter);



// Handling Unhandled Routes
app.all('*', (req, res, next) => {
	next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;