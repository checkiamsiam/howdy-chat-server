const mongoose = require('mongoose');

// connect to the database
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URI_ATLAS , {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          });
        console.log(
            `DB connection successful! at ${new Date().toLocaleString()}`
        );
    } catch (err) {
        console.log("some things went")
        console.log(err);
    }
};

mongoose.set('strictQuery', false);

module.exports = connectDB;
