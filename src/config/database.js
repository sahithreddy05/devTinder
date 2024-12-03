const mongoose = require('mongoose');


const connectDB = async () =>{

await mongoose.connect('mongodb+srv://sahithreddy:6xlhxe36oDpZu1Xa@cluster0.pwgoh.mongodb.net/devTinder');
}

module.exports = connectDB;