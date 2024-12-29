const mongoose = require("mongoose");
require("dotenv").config();

const database = process.env.DATABASE_URL;

const connection = () => {
    return mongoose.connect(database)
        .then(() => console.log("Database connection is successful."))
        .catch((error) => {
            console.error("Error occurs in Database.", error.message)
            console.error("Full error on Database is : ", error);
        }), {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    };
}


module.exports = connection