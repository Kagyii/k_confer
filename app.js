const port = 3000;
const host = "192.168.100.3";
const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const serverConfigRoute = require("./routes/route");
const authRoute = require("./routes/authentication");
const profileRoute = require("./routes/profile");
const searchRoute = require("./routes/search");
const postRoute = require("./routes/post");
const newsfeedRoute = require("./routes/newsfeed");
const suggestionRoute = require("./routes/suggestion");
const mongodb = require("./database/mongodb_connection");

app.use(bodyParser.json({ limit: "10mb" }));
app.use("/api/admin", serverConfigRoute);
app.use("/api/user", authRoute);
app.use("/api/user/profile", profileRoute);
app.use("/api/user/search", searchRoute);
app.use("/api/user/newsfeed", newsfeedRoute);
app.use("/api/user/post", postRoute);
app.use("/api/user/suggestion", suggestionRoute);

app.use((error, req, res, next) => {
  return res.json({
    status: error.status,
    detail: error.message,
  });
});

mongodb
  .connect()
  .then((result) => {
    app.listen(port, host, () => {
      console.log(`Server running at http://${host}:${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
