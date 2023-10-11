const { faker } = require('@faker-js/faker');
const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Amenity = require('../../models/amenity.model');
const User = require('../../models/user.model');
const PropertyType = require('../../models/property_type.model');
const View = require('../../models/view.model');

const dirs = fs.readdirSync(`${__dirname}/../images/places`);
const views = JSON.parse(JSON.stringify(require("./views.json")));

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: './.env' }); 
}

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

async function getIdList(Model) {
  return (await Model.find({}, {_id: 1})).map(item => item.id);
}

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB).then(() => console.log('DB connection successful!'));

(async () => {
  try {
    const propertyTypeList = await PropertyType.find({});
    const amenityIdList = await getIdList(Amenity);
    const userIdList = await getIdList(User);
    const viewIdList = await getIdList(View);
  
    const places = [];
  
    for(let i = 0; i < 25; i++) {
      const propertyType = getRandomElement(propertyTypeList);

      places.push({
        name: `${faker.person.firstName()} ${faker.company.name().toLowerCase()}`,
        property_type: propertyType.id,
        place_type: faker.helpers.arrayElement(propertyType.place_type),

        language: faker.location.country(),
        built: new Date(Date.now()).getFullYear() - faker.number.int(20),

        guests: faker.number.int(16),
        bedrooms: faker.number.int(50),
        beds: faker.number.int(50),
        bathrooms: faker.number.int(50),
        amenities: faker.helpers.arrayElements(amenityIdList, { min: 5, max: 50 }),

        price: faker.commerce.price({ dec: 0 }),
        price_type: faker.helpers.arrayElement(['night', 'week', 'month']),
        price_discount: faker.number.int(60),

        description: faker.commerce.productDescription(),

        image_cover: faker.helpers.arrayElement(dirs),
        images: faker.helpers.arrayElements(dirs, { min: 5, max: 10 }),

        location: {
          type: "Point",
          address: `${faker.location.secondaryAddress()} - ${faker.location.streetAddress()}, ${faker.location.city()}`,
          coordinates: [faker.location.longitude(), faker.location.latitude()],
          country: faker.location.country(),
          zipCode: faker.location.zipCode(),
        },

        views: faker.helpers.arrayElements(viewIdList, { min: 1, max: 2 }),

        host: `${getRandomElement(userIdList)}`,
        status: 'published',
      });
    }
  
    fs.writeFileSync('places.json', JSON.stringify(places, undefined, 2));
    console.log("Fake place successfully");

  } catch(err) {
    console.error(err);
  }

  process.exit();
  
})();
