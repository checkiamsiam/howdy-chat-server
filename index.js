// module requirements
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const device = require("express-device");
const helmet = require("helmet");
const port = process.env.PORT || 5000;
const connectDB = require("./utils/connectDB");
const globalErrorHandler = require("./middleware/globalErrorHandler");
const morgan = require("morgan");
const ExpressMongoSanitize = require("express-mongo-sanitize");
var xss = require("xss-clean");
const hpp = require("hpp");
require("dotenv").config({ path: ".env.dev" });

// create express server
const app = express();

// connection to the database
connectDB();

// global middleware
app.use(helmet());
app.use(device.capture());
app.use(cors());
app.use(express.json());
// Development logger in console
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(ExpressMongoSanitize());
app.use(xss());
app.use(hpp());

// using routes
fs.readdirSync("./routes").map((route) => app.use("/api/v1", require("./routes/" + route)));

// root
app.get("/", (req, res) => {
  res.status(200).send("Hello Server site is here!!!");
});

// Not found catch
app.all("*", (req, res) => {
  res.status(404).send({ success: false, message: "adress not found" });
});

// error handling middleware
app.use(globalErrorHandler);

// listening the port
app.listen(port, () => {
  console.log(`Server started at ${new Date().toLocaleString()} on http://localhost:${port}/`);
});
