const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongo = await mongoose.connect(process.env.MONGODB__URL, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });

    console.log(`MonogoDB Connected ${mongo.connection.host}`);
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
};

module.exports = connectDB;
