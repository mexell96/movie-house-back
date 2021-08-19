const express = require("express");
const config = require("config");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const register = require("./routes/register.routes");
const login = require("./routes/login.routes");
const users = require("./routes/users.routes");
const user = require("./routes/user.routes");
const reviews = require("./routes/reviews.routes");

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use("/api", register);
app.use("/api", login);
app.use("/api", users);
app.use("/api", user);
app.use("/api", reviews);

// if (process.env.NODE_ENV === "production") {
//   app.use("/", express.static(path.join("..", "movie-house", "build")));

//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve("..", "movie-house", "build", "index.html"));
//   });
// }

// const PORT = config.get("port") || 5000;
const PORT = process.env.PORT || 5000;

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
