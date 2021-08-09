const express = require("express");
const config = require("config");
const path = require("path");
const mongoose = require("mongoose");

const app = express();

app.use(express.json({ extended: true }));

app.use("/api", require("./routes/register.routes"));
app.use("/api", require("./routes/login.routes"));
app.use("/api", require("./routes/users.routes"));
app.use("/api", require("./routes/user.routes"));

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
    app.listen(PORT, () =>
      console.log(`Server has been started on port --- ${PORT}`)
    );
  } catch (error) {
    console.log("Server Error ---", error.message);
    process.exit(1);
  }
}

start();
