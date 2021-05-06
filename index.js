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

// COR
app.use(cors());

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

// ROUTES DECLARATION & IMPORT

const userRoutes = require("./routes/userRoute.js");
app.use("/user", userRoutes);

const commentRoutes = require("./routes/commentRoute.js");
app.use("/comment", commentRoutes);

const profileRoutes = require("./routes/profileRoute.js");
app.use("/profile", profileRoutes);

const activitiesRoutes = require("./routes/activitiesRoute.js");
app.use("/activity", activitiesRoutes);

const utilsRoutes = require("./routes/utilsRoute.js");
app.use("/utils", utilsRoutes);

// ROUTES DECLARATION & IMPORT

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

// Listen Server
if (process.env.NODE_ENV !== "test") {
  let PORT = 3000;
  let server = app.listen(PORT, () =>
    console.log(`server running on PORT : ${PORT}`)
  );

  //======================== Socket IO Server =========================
  const io = socketIo(server, {
    cors: {
      origin: "*",
    },
    path: "/socket",
    serveClient: false,
  });

  const chatRoutes = require("./routes/chatRoute.js");
  app.use(
    "/chat",
    (req, res, next) => {
      req.io = io;
      next();
    },
    chatRoutes
  );

  const commentRoutes = require("./routes/commentRoute.js");
  app.use(
    "/comment",
    (req, res, next) => {
      req.io = io;
      next();
    },
    commentRoutes
  );

  const profileRoutes = require("./routes/profileRoute.js");
  app.use(
    "/profile",
    (req, res, next) => {
      req.io = io;
      next();
    },
    profileRoutes
  );

  const statusRoutes = require("./routes/statusRoute.js");
  app.use(
    "/status",
    (req, res, next) => {
      req.io = io;
      next();
    },
    statusRoutes
  );

  //======================== END SOCKET IO Server=====================
} else module.exports = app;
