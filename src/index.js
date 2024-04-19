const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const userRoute = require("./routes/user.routes.js");
const postRoute = require("./routes/posts.routes.js");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

//Middlewares
app.use(express.json());
app.use(bodyParser.json());
app.use("/user", userRoute);
app.use("/posts", postRoute);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Api" });
});

app.all("*", (req, res) => {
  res.json({ message: "Page Not Found" });
});

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to database");
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
