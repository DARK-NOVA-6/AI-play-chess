const express = require("express");
const http = require("http");
const app = express();
const fs = require('fs').promises;

const host = '0.0.0.0';
const port = 3100;

app.listen(port, host);
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/base.html");
});

