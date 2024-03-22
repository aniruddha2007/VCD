const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const Grid = require("gridfs-stream");
const app = express();

// Create mongo connection
const conn = mongoose.createConnection("mongodb://localhost:27017/test", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Init gfs after the connection is open
conn.once("open", () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("uploads");
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Initialize gfs outside the callback
let gfs;

// @route POST /upload
// @desc  Uploads file to DB
app.post("/upload", upload.single("file"), (req, res) => {
  if (!gfs) {
    return res.status(500).send("GridFS stream not initialized.");
  }

  const fs = require("fs");
  const path = require("path");

  const writestream = new gfs.createWriteStream({
    filename: req.file.originalname,
  });

  fs.createReadStream(path.resolve(req.file.path)).pipe(writestream);

  writestream.on("finish", () => {
    fs.unlinkSync(req.file.path);
    res.redirect("/");
  });
});

// @route GET /
// @desc  Display form
app.get("/", (req, res) => {
  res.send("Hello World!");
});

const port = 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});