const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Amenity = require('../../models/amenity.model');
const Interest = require('../../models/interest.model');
const Place = require('../../models/place.model');
const User = require('../../models/user.model');
const PropertyType = require('../../models/property_type.model');
const View = require('../../models/view.model');
// const Review = require('../../models/reviewModel');

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: './.env' }); // read variable from file config.env and save them into node.js environment variables 
}

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose
  .connect(DB)
  .then(() => console.log('DB connection successful!'))
  .catch(err => console.error(err));

// READ JSON FILE
const places = JSON.parse(fs.readFileSync(`${__dirname}/places.json`, 'utf-8'));
// const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
// const property_types = JSON.parse(fs.readFileSync(`${__dirname}/property_types.json`, 'utf-8'));
// let amenities = JSON.parse(fs.readFileSync(`${__dirname}/amenities.json`, 'utf-8'));
// let interests = JSON.parse(fs.readFileSync(`${__dirname}/interests.json`, 'utf-8'));
// let views = JSON.parse(fs.readFileSync(`${__dirname}/views.json`, 'utf-8'));
// IMPORT DATA INTO DB

const importData = async () => {
  try {

    // interests = interests.map((interest, i) => ({
    //   ...interest, 
    //   interest_id: i
    // }));
    // await PropertyType.create(property_types);
    await Place.create(places);
    // await User.create([...users].slice(900, 1000));
    // await View.create(views);
    // await Interest.create(interests);

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
    // await Interest.deleteMany();
    // await PropertyType.deleteMany();
    // await View.deleteMany();
    // await Amenity.deleteMany();
    await User.deleteMany();
    // await Place.deleteMany();

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