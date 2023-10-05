const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Amenity = require('../../models/amenity.model');
const Place = require('../../models/place.model');
// const Review = require('../../models/reviewModel');
// const User = require('../../models/userModel');

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: './.env' }); // read variable from file config.env and save them into node.js environment variables 
}

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB).then(() => console.log('DB connection successful!'));

// READ JSON FILE
const places = JSON.parse(fs.readFileSync(`${__dirname}/places.json`, 'utf-8'));
// let amenities = JSON.parse(fs.readFileSync(`${__dirname}/amenities.json`, 'utf-8'));

// IMPORT DATA INTO DB
const importData = async () => {
  try {

    // amenities = amenities.map(a => ({...a, iconImage: `${a.name.replace(' ', '_')}.png`}));
    
    await Place.create(places);

    console.log('Data successfully loaded!');
  }
  catch (err) {
    console.error(err);
  }
  process.exit();
}

// DELETE ALL DATA IN DB
const deleteData = async () => {
  try {
    await Place.deleteMany();
    console.log('Data successfully deleted!');
  }
  catch (err) {
    console.error(err);
  }
  process.exit();
}

if (process.argv[2] === '--import') {
  importData();
}
else if (process.argv[2] === '--delete') {
  deleteData();
}