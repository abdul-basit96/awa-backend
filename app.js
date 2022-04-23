var express = require('express');
var app = express();

var bodyParser = require('body-parser')
var path = require('path');

require("./db/mongoose");
const UserRouter = require('./routers/user');
const UploadRouter = require('./routers/upload');

const port = process.env.PORT || 5000;

const cors = require("cors");
var dir = path.join(__dirname, 'public');
app.use(cors());
app.use(express.static(dir));

 // Middleware that transforms the raw string of req.body into json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-type");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});


app.get("/status", (req, res) => {
  res.status(200).send("backend working");
})
app.use("/api", UserRouter);
app.use("/api", UploadRouter);

var server = app.listen(port, function () {
   var host = server.address().address
   
   console.log("Server listening at ", host, port)
})