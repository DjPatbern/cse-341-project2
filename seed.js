require("dotenv").config();
const mongoose = require("mongoose");
const Manufacturer = require("./models/manufacturer");

mongoose.connect(process.env.MONGO_URI);

async function seed() {
  await Manufacturer.deleteMany();

  const sample = await Manufacturer.create({
    name: "Toyota",
    country: "Japan"
  });

  console.log("Sample manufacturer created:");
  console.log(sample);
  mongoose.connection.close();
}

seed();
