const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();

app.use(cors());

app.use(express.json());

const countries = JSON.parse(fs.readFileSync(`${__dirname}/data/countries.json`, 'utf-8'));

app.get('/_health', (req, res) => {
  res.status(200).json({
    message: "Api is very ok!",
    status: 'success'
  });
});

app.post('/api/v1/auth/signup', (req, res) => {
  console.log("Auth data: ", req.body);
  res.status(200).json({
    status: 'success',
    data: req.body.data
  });
});

app.get('/api/v1/resources/countries', (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      countries
    }
  });
});

module.exports = app;