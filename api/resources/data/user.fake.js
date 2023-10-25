const { faker } = require('@faker-js/faker');
const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Interest = require('../../models/interest.model');
const User = require('../../models/user.model');

const dirs = fs.readdirSync(`${__dirname}/../images/places`);
const countries = JSON.parse(fs.readFileSync(`${__dirname}/countries.json`));
const universities = JSON.parse(fs.readFileSync(`${__dirname}/universities.json`)).map(uni => uni.name);
const languages = [...new Set(countries.map(country => country.language.name))];

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: './.env' }); 
}

async function getIdList(Model) {
  return (await Model.find({}, {_id: 1})).map(item => item.id);
}

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB).then(() => console.log('DB connection successful!'));

const create = async () => {
  try {
    const interestIdList = await getIdList(Interest);
  
    const users = [];
  
    for(let i = 0; i < 200; i++) {

      users.push({
        name: `${faker.person.firstName()} ${faker.person.lastName()}`,
        description: faker.lorem.paragraph({ min: 3, max: 7 }),
        email: faker.internet.email(),

        avatar: faker.image.avatar(),
        password: '12345',
        passwordConfirm: '12345',
        interests: faker.helpers.arrayElements(interestIdList, { min: 3, max: 10 }),

        school: faker.helpers.arrayElement(universities),
        address: `${faker.location.city()}, ${faker.location.country()}`,
        decade_born: faker.helpers.arrayElement([40, 50, 60, 70, 80, 90]),
        obsessed_with: faker.lorem.sentence(10),
        useless_skill: faker.lorem.sentence(8),
        time_consuming_activity: faker.lorem.sentence({ min: 1, max: 7 }),
        work: faker.person.jobTitle(),
        languages: faker.helpers.arrayElements(languages, { min: 1, max: 7 }),

        favorite_song: faker.music.songName(),
        fun_fact: faker.lorem.sentence(10),
        biography_title: faker.person.bio(),
        pets: faker.helpers.arrayElements([
          faker.animal.cat(),
          faker.animal.bird(),
          faker.animal.cow(),
          faker.animal.dog(),
          faker.animal.fish(),
          faker.animal.horse(),
          faker.animal.rabbit()
        ], { min: 1, max: 3 }),
        showPastTrips: true,
        year_hosting: 5
      });
    }
  
    fs.writeFileSync('users.json', JSON.stringify(users, undefined, 2));
    console.log("Fake users successfully");

  } catch(err) {
    console.error(err);
  }

  process.exit();
  
};

const addFields= async () => {
  // try {
  //   const placeIdList = await Place.find({}, { _id: 1 });

  //   placeIdList.forEach(async (placeId) => {
  //     const randVal = {
  //       'rules.children' : faker.number.int(10),
  //       'rules.pets': faker.number.int(3),
  //       'rules.pets_allowed': this['rules.pets'] > 0
  //     };

  //     await Place.findByIdAndUpdate(placeId, { $set: randVal });
  //     console.log("Add some fields successfully");
  //   });
  // } catch (err) {
  //   console.error(err);
  // }

  // process.exit();

}


if (process.argv[2] === '--add-fields') {
  addFields();
}
else if (process.argv[2] === '--create') {
  create();
}