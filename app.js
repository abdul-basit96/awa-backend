var express = require('express');
var app = express();
require('./routers/index');
require("./db/mongoose");

const port = process.env.PORT || 5000;

const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-type");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});


var server = app.listen(port, function () {
   var host = server.address().address
   
   console.log("Server listening at ", host, port)
})