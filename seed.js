require('dotenv').config();
const mongoose = require('mongoose');
const Manufacturer = require('./models/manufacturer');
const Car = require('./models/car');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    console.log('Connected to DB for seeding');

    await Car.deleteMany({});
    await Manufacturer.deleteMany({});

    const toyota = await Manufacturer.create({
      name: 'Toyota',
      country: 'Japan',
      foundedYear: 1937,
      ceo: 'Koji Sato',
      totalEmployees: 360000,
      headquarters: 'Toyota City, Aichi',
      website: 'https://global.toyota'
    });

    const corolla = await Car.create({
      model: 'Corolla',
      year: 2020,
      price: 21000,
      type: 'Sedan',
      manufacturer: toyota._id,
      fuel: 'Hybrid',
      horsepower: 169
    });

    console.log('Seed finished:');
    console.log('Manufacturer:', toyota._id.toString());
    console.log('Car:', corolla._id.toString());

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Seed error', err);
    process.exit(1);
  }
}

seed();
