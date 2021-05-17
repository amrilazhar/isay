require("dotenv").config({
	path: `.env.${process.env.NODE_ENV}`,
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
const fileUpload = require("express-fileupload");
const socketIo = require("socket.io");
const http = require("http").Server(app);

//======================== Socket IO Server =========================
const io = socketIo(http, {
	cors: {
		origin: "*",
	},
	path: "/socket",
	serveClient: false,
});
//======================== END SOCKET IO Server=====================

// COR
app.use(cors());

const admin = require("./utils/firebase");
// const mongooseConnect = require("./utils/database");

// Assign socket object to every request
app.use((req, res, next) => {
	req.io = io;
	next();
});

//Set body parser for HTTP post operation
app.use(express.json()); // support json encoded bodies
app.use(
	express.urlencoded({
		extended: true,
	})
); // support url encoded bodies

//set fileUpload plugins
app.use(fileUpload()); //support Form Data

//set static assets to public directory
app.use(express.static("public"));

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

if (process.env.NODE_ENV === "development") {
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

// ============== ROUTES DECLARATION & IMPORT ====================== //

const userRoutes = require("./routes/userRoute.js");
app.use("/user", userRoutes);

const activitiesRoutes = require("./routes/activitiesRoute.js");
app.use("/activity", activitiesRoutes);

const utilsRoutes = require("./routes/utilsRoute.js");
app.use("/utils", utilsRoutes);

const chatRoutes = require("./routes/chatRoute.js");
app.use("/chat", chatRoutes);

const commentRoutes = require("./routes/commentRoute.js");
app.use("/comment",	commentRoutes);

const profileRoutes = require("./routes/profileRoute.js");
app.use("/profile",	profileRoutes);

const statusRoutes = require("./routes/statusRoute.js");
app.use("/status", statusRoutes);

// ============== END ROUTES DECLARATION & IMPORT ====================== //

//========================= Error Handler ==========================
app.use((err, req, res, next) => {
	console.log(err);
	const status = err.statusCode || 500;
	const message = err.message;
	const data = err.data;
	res.status(status).json({ success: false, message: message, data: data });
});
//========================= End Error Handler ======================

//======================== Listen Server ===========================
if (process.env.NODE_ENV !== "test") {
	let PORT = 3000;
	http.listen(PORT, () => console.log(`server running on PORT : ${PORT}`));
} else module.exports = app;
//======================== End Listen Server =======================
