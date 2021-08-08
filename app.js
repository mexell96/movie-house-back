const express = require("express");
const config = require("config");
const path = require("path");
const mongoose = require("mongoose");

const app = express();

app.use(express.json({ extended: true }));

app.use("/api/auth", require("./routes/auth.routes"));

if (process.env.NODE_ENV === "production") {
  app.use("/", express.static(path.join("..", "movie-house", "build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve("..", "movie-house", "build", "index.html"));
  });
}

const PORT = config.get("port") || 5000;

async function start() {
  try {
    await mongoose.connect(config.get("mongoUri")),
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      };
    app.listen(PORT, () => console.log(`Port --- ${PORT}`));
  } catch (error) {
    console.log("Server Error ---", error.message);
    process.exit(1);
  }
}

start();
