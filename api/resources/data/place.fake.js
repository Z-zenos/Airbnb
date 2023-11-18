const { faker } = require('@faker-js/faker');
const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Amenity = require('../../models/amenity.model');
const User = require('../../models/user.model');
const PropertyType = require('../../models/property_type.model');
const View = require('../../models/view.model');
const Place = require('../../models/place.model');

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

const create = async () => {
  try {
    const propertyTypeList = await PropertyType.find({});
    const amenityIdList = await getIdList(Amenity);
    const userIdList = await getIdList(User);
    const viewIdList = await getIdList(View);
  
    const places = [];
  
    for(let i = 0; i < 5000; i++) {
      const propertyType = getRandomElement(propertyTypeList);
      const pets = faker.number.int(3);

      places.push({
        name: `${faker.person.firstName()} ${faker.company.name().toLowerCase()}`,
        property_type: propertyType.id,
        place_type: faker.helpers.arrayElement(propertyType.place_type),

        language: faker.location.country(),
        built: new Date(Date.now()).getFullYear() - faker.number.int(20),

        guests: faker.number.int({ min: 1, max: 16 }),
        bedrooms: faker.number.int({ min: 1, max: 50 }),
        beds: faker.number.int({ min: 1, max: 50 }),
        bathrooms: faker.number.int({ min:1, max: 50 }),
        amenities: faker.helpers.arrayElements(amenityIdList, { min: 5, max: 50 }),

        price: faker.commerce.price({ dec: 0 }),
        price_type: faker.helpers.arrayElement(['night', 'week', 'month']),
        price_discount: faker.number.int(60) / 100,

        description: faker.commerce.productDescription(),

        image_cover: faker.helpers.arrayElement(dirs),
        images: faker.helpers.arrayElements(dirs, { min: 5, max: 10 }),

        location: {
          type: "Point",
          address: `${faker.location.secondaryAddress()} - ${faker.location.streetAddress()}, ${faker.location.city()}`,
          coordinates: [faker.location.longitude(), faker.location.latitude()],
          country: faker.location.country(),
          zipCode: faker.location.zipCode(),
          region: faker.helpers.arrayElement(['Europe', 'Australia', 'North America', 'South America', 'Asia'])
        },

        views: faker.helpers.arrayElements(viewIdList, { min: 1, max: 2 }),
        rules: {
          children: faker.number.int(10),
          pets: pets,
          pets_allowed: pets > 0
        },

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
  
};

const addFields= async () => {
  try {
    const placeIdList = await Place.find({}, { _id: 1 });

    placeIdList.forEach(async (placeId) => {
      const randVal = {
        'rules.children' : faker.number.int(10),
        'rules.pets': faker.number.int(3),
        'rules.pets_allowed': this['rules.pets'] > 0
      };

      await Place.findByIdAndUpdate(placeId, { $set: randVal });
      console.log("Add some fields successfully");
    });
  } catch (err) {
    console.error(err);
  }

  process.exit();

}


if (process.argv[2] === '--add-fields') {
  addFields();
}
else if (process.argv[2] === '--create') {
  create();
}