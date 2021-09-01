require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const router = require("./router/index");
const errorMiddleware = require("./middleware/error.middleware");

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);
app.use("/api", router);
app.use(errorMiddleware);

const start = async () => {
  try {
    await mongoose.connect(process.env.DB_URL),
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      };
    app.listen(PORT, () =>
      console.log(`Server has been started on port --- ${PORT}`)
    );
  } catch (error) {
    console.log("Server Error ---", error.message);
    process.exit(1);
  }
};

start();
