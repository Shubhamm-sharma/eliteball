const express = require("express");
const app = express();
require("dotenv").config();
app.use(express.json());
const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database Successfully Connected to eliteball");
  })
  .catch((err) => {
    console.log("Unable to connect to MongoDB. Error: " + err);
  });

app.listen(process.env.PORT, () =>
  console.log(`Example app listening at ${process.env.PORT}`)
);
