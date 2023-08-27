const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express(); 
const dotenv = require('dotenv')

dotenv.config()
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });

const carRoutes = require("./routes/carRoute");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );
    next();
  });
app.use("/api/car",carRoutes);

  module.exports = app;