const { faker } = require('@faker-js/faker');
const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Amenity = require('../../models/amenity.model');
const User = require('../../models/user.model');
const PlaceType = require('../../models/place_type.model');

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
    const placeTypeIdList = await getIdList(PlaceType);
    const amenityIdList = await getIdList(Amenity);
    const userIdList = await getIdList(User);
  
    const places = [];
  
    for(let i = 0; i < 10; i++) {
      places.push({
        name: `${faker.person.firstName()} ${faker.company.name().toLowerCase()}`,
        placeType: `${getRandomElement(placeTypeIdList)}`,
        language: faker.location.country(),
        guests: faker.number.int(16),
        bedrooms: faker.number.int(50),
        beds: faker.number.int(50),
        bathrooms: faker.number.int(50),
        amenities: faker.helpers.arrayElements(amenityIdList, { min: 5, max: 100 }),
        price: faker.commerce.price({ dec: 0 }),
        priceType: faker.helpers.arrayElement(['night', 'week', 'month']),
        priceDiscount: faker.number.int(60),
        description: faker.commerce.productDescription(),
        imageCover: '0',
        images: ['1', '2', '3', '4', '5'],
        location: {
          type: "Point",
          address: `${faker.location.secondaryAddress()} - ${faker.location.streetAddress()}, ${faker.location.city()}`,
          coordinates: [faker.location.longitude(), faker.location.latitude()],
          country: faker.location.country(),
          postalCode: faker.location.zipCode(),
        },
        host: `${getRandomElement(userIdList)}`,
        status: 'published'
      });
    }
  
    fs.writeFileSync('places.json', JSON.stringify(places, undefined, 2));
    console.log("Fake place successfully");

  } catch(err) {
    console.error(err);
  }

  process.exit();
  
})();