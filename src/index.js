const express = require("express");
const path = require("path");
const collection = require("./config");
const bcrypt = require('bcrypt');
const app = express();
const session = require('express-session');


app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.get("/", (req, res) => {
    res.render("login");
});
app.get("/signup", (req, res) => {
    res.render("signup");
});

app.post("/signup", async (req, res) => {
    const data = {
        name: req.body.username,
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone,
        gender: req.body.gender,
        dob: req.body.dob
    }
    const existingUser = await collection.findOne({ email: data.email });
    if (existingUser) {
        res.send('User with this email already exists. Please choose a different email.');
    } else {
        
        const saltRounds = 10; 
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);

        data.password = hashedPassword; 
        const userdata = await collection.insertMany([data]);
        console.log(userdata);
        res.redirect('/'); 
    }
});


app.post("/login", async (req, res) => {
    try {
      const check = await collection.findOne({ email: req.body.email });
      if (!check) {
        res.render("home");
        return;
      }
      const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
      if (!isPasswordMatch) {
        return res.send("Wrong Password");
      } else {
        req.session.userId = check._id.toString(); 
        return res.render("home");
      }
    } catch (err) {
      res.send("Something went wrong!");
    }
  });



app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
  });

const port = 5000;
app.listen(port, () => {
    console.log('Server listening on port ${port}');
});