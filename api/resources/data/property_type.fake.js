const {faker} = require("@faker-js/faker");
const fs = require('fs');

const dirs = fs.readdirSync(`${__dirname}/../images/property_types`);

(async () => {
  try {
    const property_types = [];
  
    dirs.forEach((image, i) => {
      property_types.push({
        name: image.replace('.png', '').replace(/_/g, ' '),
        iconImage: image,
        place_type: faker.helpers.arrayElements(['room', 'entire home', 'shared room'], { min: 1, max: 3 }),
      });
    });
  
    fs.writeFileSync('property_types.json', JSON.stringify(property_types, undefined, 2));
    console.log("Fake property types successfully");

  } catch(err) {
    console.error(err);
  }

  process.exit();
  
})();