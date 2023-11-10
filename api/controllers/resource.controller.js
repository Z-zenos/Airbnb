const fs = require("fs");
const catchErrorAsync = require("../utils/catchErrorAsync");
const Interest = require("../models/interest.model");

const countries = JSON.parse(fs.readFileSync(`${__dirname}/../resources/data/countries.json`, 'utf-8'));
const cities = JSON.parse(fs.readFileSync(`${__dirname}/../resources/data/worldcities.json`, 'utf-8'));
// const exchangeRateList = JSON.parse(fs.readFileSync(`${__dirname}/../resources/data/exchange_rate.json`, 'utf-8'));

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

exports.getAllLanguages = (req, res, next) => {
  const languages = [...new Set(countries.map(country => country.language.name))];
  res.status(200).json({
    status: 'success',
    data: {
      languages
    }
  });
}

exports.getCitiesByKeyword = (req, res, next) => {
  const { keyword } = req.query;
  const filteredCities = cities
    .filter(city => city.city.toLowerCase().startsWith(keyword.trim().toLowerCase()))
    .map(city => ({ 
      name: city.city,
      local_name: city.admin_name,
      country: city.country 
    }));

  res.status(200).json({
    status: 'success',
    data: {
      cities: filteredCities
    }
  });
}

exports.getAllInterests =  catchErrorAsync(async (req, res, next) => {
  const interests = await Interest.find({}, { iconImage: 1, interest_id: 1, name: 1  });

  res.status(200).json({
    status: 'success',
    data: {
      interests
    }
  });
});

// countries.forEach(country => {
//   if(country.currency.code === 'USD') {
//     country.currency.rate = 1;
//     country.currency.date = "Thu, 2 Nov 2023 23:55:01 GMT";
//     country.currency.inverse_rate = 1;
//     return;
//   }
//   const filteredCountry = exchangeRateList.filter(er => er.code === country.currency.code);
//   if(filteredCountry.length) {
//     country.currency.rate = filteredCountry[0].rate;
//     country.currency.date = filteredCountry[0].date;
//     country.currency.inverse_rate = filteredCountry[0].inverseRate;
//   }
// });

// fs.writeFileSync('countries.json', JSON.stringify(countries, undefined, 2));