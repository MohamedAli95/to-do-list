const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const itemRoutes = require("./routes/item");
const userRoutes = require('./routes/user');

mongoose.connect("mongodb+srv://mohamed:1b4Popsw0Qe3AuAJ@cluster0-kaqrb.mongodb.net/test?retryWrites=true&w=majority").
then(() => {
  console.log('connected to database!')
}).
catch(() =>{
  console.log('connection failed!');
});

app.use(bodyParser.json());

app.use((req,res,next)=>{
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader("Access-Control-Allow-Headers",
  "Origin,X-Requested-With,Content-Type,Accept,Authorization");
  res.setHeader("Access-Control-Allow-Methods","GET,PATCH,PUT,POST,DELETE ,OPTIONS");
  next();
});
app.use("/",express.static(path.join(__dirname,"To-do-list-app")));
app.use('/api/items',itemRoutes);
app.use('/api/user',userRoutes);
app.use((req,res, next)=>{
  res.sendFile(__dirname,"To-do-list-app","index.html");
})
module.exports = app;
