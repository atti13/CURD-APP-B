require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const userRoute = require("./routes/user");
var bodyParser = require("body-parser");
var cors = require("cors");

const app = express();
const PORT =  process.env.PORT || 8000;

mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGO_URL)
  .then((e) => console.log("MongoDB Connected"));


app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

var corsOptions = {
  origin: process.env.CORS,
  methods: "GET, POST, DELETE , PATCH",
  credentials: true,
};

app.use(cors(corsOptions));

app.use("/user", userRoute);

app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));
