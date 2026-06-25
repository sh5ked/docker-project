const mongoose = require('mongoose');

async function connectDB() {
    try {
       await mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.mzccazm.mongodb.net/${process.env.DB_NAME}`)
       console.log("Mongo DB connected successfully");
       
    } catch (error) {
        console.error("DB connection failed");
        console.error(error)
    }
}
module.exports = connectDB;



