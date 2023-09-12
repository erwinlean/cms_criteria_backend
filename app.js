"use strict";

const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const db = require ("./db/config");
const cors = require("./middlewares/cors");

// Routers
const indexRouter = require("./routes/index");         // Handles index routes
const oAuthRouter = require("./routes/auth");          // Handles OAuth routes
const consumerRouter = require("./routes/consumer");   // Handles consumer-specific routes
const userRouter = require("./routes/users");          // Handles user-related routes
const fileRouter = require("./routes/files");          // Handles file-related routes
const resetRouter = require("./routes/passwordReset"); // Handles password reset routes
const pdfRouter = require("./routes/pdf");             // Handles PDF generation routes

const app = express();

// Data base
app.use((req, res, next) => {
  req.db = db;
  next();
});

// Cors
app.use(cors);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Endpoints
app.use("/", indexRouter);                // Handles root and API index routes (tested)
app.use("/api/", indexRouter);            // Handles API routes (tested)
app.use("/api/oAuth", oAuthRouter);       // Handles OAuth routes (tested)
app.use("/api/consumer", consumerRouter); // Handles consumer-specific routes (tested)
app.use("/api/users", userRouter);        // Handles user-related routes (tested)
app.use("/api/files", fileRouter);        // Handles file-related routes (tested)
app.use("/api/pdf", pdfRouter);           // Handles PDF generation routes (tested)
app.use("/api/reset", resetRouter);       // Handles password reset routes (tested)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;