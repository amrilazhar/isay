require("dotenv").config({
	path: `${process.env.NODE_ENV}.env`,
});

// Express
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const helmet = require("helmet");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const morgan = require("morgan");

const express = require("express");
const app = express();

const admin = require("./utils/firebase");
const mongooseConnect = require("./utils/database");

// const fileUpload = require("express-fileupload");

//Set body parser for HTTP post operation
app.use(express.json()); // support json encoded bodies
app.use(
	express.urlencoded({
		extended: true,
	})
); // support url encoded bodies

//set fileUpload plugins
// app.use(fileUpload()); //support Form Data

//======================== security code ==============================//
// Sanitize data
app.use(mongoSanitize());

// Prevent XSS attact
app.use(xss());

// Rate limiting
const limiter = rateLimit({
	windowMs: 1 * 60 * 1000, // 10 mins
	max: 100,
});

app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Use helmet
app.use(
	helmet({
		contentSecurityPolicy: false,
	})
);

// CORS
app.use(cors());

if (process.env.NODE_ENV === "dev") {
	app.use(morgan("dev"));
} else {
	// create a write stream (in append mode)
	let accessLogStream = fs.createWriteStream(
		path.join(__dirname, "access.log"),
		{
			flags: "a",
		}
	);

	// setup the logger
	app.use(morgan("combined", { stream: accessLogStream }));
}
//======================== end security code ==============================//

//set static assets to public directory
app.use(express.static("public"));

// ROUTES DECLARATION & IMPORT

const userRoutes = require("./routes/userRoute.js");
app.use("/user", userRoutes);

// const commentRoutes = require("./routes/commentRoute.js");
// app.use("/user", commentRoutes);

// const statusRoutes = require("./routes/statusRoute.js");
// app.use("/user", statusRoutes);

// const profileRoutes = require("./routes/profileRoute.js");
// app.use("/user", profileRoutes);

// const activitiesRoutes = require("./routes/activitiesRoute.js");
// app.use("/user", activitiesRoutes);

// ROUTES DECLARATION & IMPORT

app.use((err, req, res, next) => {
	console.log(err);
	const status = err.statusCode || 500;
	const message = err.message;
	const data = err.data;
	res.status(status).json({ success: false, message: message, data: data });
});

// Listen Server
if (process.env.NODE_ENV !== "test") {
	mongooseConnect
		.then(() => {
			console.log("Database connected");
			app.listen(process.env.PORT, () =>
				console.log(`server running on PORT : ${process.env.PORT}`)
			);
		})
		.catch((e) => console.log(e));
} else module.exports = app;
