"use strict";

const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const db = require ("./db/config");
const cors = require("./middlewares/cors");

const indexRouter = require("./routes/index");
const oAuthRouter = require("./routes/auth");
const consumerRouter = require("./routes/consumer");
const userRouter = require("./routes/users");
const fileRouter = require("./routes/files");
const resetRouter = require("./routes/passwordReset");
const pdfRouter = require("./routes/pdf");

const app = express();

// DB
app.use((req, res, next) => {
  req.db = db;
  next();
});

app.use(cors);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);                   // tested fine > mocha chai + postman + frontend
app.use("/api/", indexRouter);               // tested fine > mocha chai + postman + frontend
app.use("/api/oAuth", oAuthRouter);          // tested fine > mocha chai + postman + frontend
app.use("/api/consumer", consumerRouter);    // tested fine > postman + frontend
app.use("/api/users", userRouter);           // tested fine > postman + frontend
app.use("/api/files", fileRouter);           // tested fine > postman + frontend
app.use("/api/pdf", pdfRouter);              // PDF generator untested
app.use("/api/reset", resetRouter);          // Reset password by email untested
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