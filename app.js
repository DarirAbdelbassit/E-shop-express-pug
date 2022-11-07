const express =require("express");
const app = express(); 
const http = require("http");
const port = 8080; 
const host = "localhost";
var path = require('path');
  app.use(express.static(__dirname+'/public'));
  app.use(express.static(__dirname+'/public/templates'));
  app.get('/login.html/:username=/:password=d')
app.listen(port, host, (req, res) => {
    console.log(`http://${host}:${port}`);
  });