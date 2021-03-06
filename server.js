const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const connectDB = require("./config/db");
const colors = require("colors");
const errorHandler = require("./middleware/error");
const fileupload = require("express-fileupload");
const path = require("path");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const hpp = require("hpp");
const cors = require("cors");

//Loading config
dotenv.config({ path: "./config/config.env" });

//Connecting to Database
connectDB();

//Routing
const posts = require("./routes/posts");
const auth = require("./routes/auth");
const clubs = require("./routes/clubs");

//Actual express app
const app = express();

//Body parsing for Json
app.use(express.json());

//Cookie Parser
app.use(cookieParser());

//Security stuff
app.use(mongoSanitize());
app.use(helmet());
app.use(xss());
app.use(hpp());

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

//File uploader middleware
app.use(fileupload());

//Morgan
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//Setting static folder
app.use(express.static(path.join(__dirname, "public")));

//Mount routers
app.use("/api/v1/posts", posts);
app.use("/api/v1/clubs", clubs);
app.use("/api/v1/auth", auth);

//Custom Error Handling Part
app.use(errorHandler);

//Port number settings up
const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow
      .underline
  )
);

//Handling rejections
process.on("unhandledRejection", (err, promise) => {
  console.log("Unhandled rejection at: ", promise, " reason: ", res);
  server.close(() => process.exit(1));
});
