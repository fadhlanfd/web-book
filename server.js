//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const _ = require("lodash");
const path = require("path");
const User = require("./model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "nkagln421nk41ln%224))asgnwangflanglwan4@@**($(!$&!(l421421sga";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/login-app-db");

app.use("/", express.static(path.join(__dirname, "static")));
app.use(express.json());

// app.post("/api/books", async (req, res) => {
//   const {judul, isbn, penerbit, deskripsi} = req.body;
//
// })

app.post("/api/change-password", async (req, res) => {
  const { token, newpassword : plainTextPassword } = req.body;

  if(!plainTextPassword || typeof plainTextPassword !== "string") {
    return res.json({ status: "error", error: "Invalid Password" });
  }

  if(plainTextPassword.length < 5) {
    return res.json({
    status: "error",
    error: "Password too small. Should be at least 6 characters "
    });
  }

  try {
      const user = jwt.verify(token, JWT_SECRET);
      const _id = user.id;
      const password = await bcrypt.hash(plainTextPassword, 10);

      await User.updateOne(
        { _id },
      {
        $set: { password }
      }
    )
    res.json({ status: "ok" })
  } catch (error) {
    console.log(error)
    res.json({ status : "error", error: ";))" });
  }
});

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username }).lean()

  if (!user) {
    return res.json({ status: "error", error: "Invalid username/password"});
  }

  if(await bcrypt.compare(password, user.password)) {

    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET);

    return res.json({ status : "ok", data: token });
  }

  res.json({ status : "error", error: "Invalid username/password" });
});

app.post("/api/register", async (req, res) => {
  const { username, password : plainTextPassword, profileName, address } = req.body;

  if(!username || typeof username !== "string") {
    return res.json({ status: "error", error: "Invalid Username" });
  }

  if(!plainTextPassword || typeof plainTextPassword !== "string") {
    return res.json({ status: "error", error: "Invalid Password" });
  }

  if(plainTextPassword.length < 5) {
    return res.json({
    status: "error",
    error: "Password too small. Should be at least 6 characters "
    });
  }

  const password = await bcrypt.hashSync(plainTextPassword, 10)

  try {
    const response = await User.create({
      username,
      password,
      profileName,
      address
    })
    console.log("User create successfully : ", response);
  } catch (error) {
    if(error.code === 11000 ) {
      return res.json({ status: "error", error: "Username already in use" });
    }
    throw error;
  }

  res.json({ status: "ok" });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
