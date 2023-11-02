const fs = require("fs");

const countries = JSON.parse(fs.readFileSync(`${__dirname}/../resources/data/countries.json`, 'utf-8'));

exports.getAllCountries = (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: {
      countries
    }
  });
};

exports.getAllCurrencies = (req, res, next) => {
  const currencies = countries.map(country => country.currency);

  res.status(200).json({
    status: 'success',
    data: {
      currencies
    }
  });
};