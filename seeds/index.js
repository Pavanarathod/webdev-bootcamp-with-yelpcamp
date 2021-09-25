const CampGround = require("../modals/campground");
const conectDB = require("../db/mongoose");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelper");
const mongoose = require("mongoose");

conectDB();

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDb = async () => {
  await CampGround.deleteMany({});

  for (let i = 0; i < 50; i++) {
    const random = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;

    const camp = new CampGround({
      location: `${cities[random].city}, ${cities[random].state}`,
      title: `${sample(descriptors)}, ${sample(places)}`,
      image: "https://source.unsplash.com/collection/155011",
      author: "611a707088ab032934e4fc3a",
      description:
        "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quis cupiditate voluptas impedit quasi.",
      price,
    });

    await camp.save();
  }
};

seedDb().then(() => {
  mongoose.connection.close();
});
