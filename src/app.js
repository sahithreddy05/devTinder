const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user');
const app = express();



app.post("/signup", async (req, res) => {
    const user = new User({
        firstName: "sahith",
        lastName: "reddy",
        emailId: "sahithreddy050101@gmail.com",
        password: "123456",
        age: "24",
        gender: "male"
    });

    try{
    await user.save();
    res.send("user added successfully");
    }catch(err){
        res.status(400).send("Error saving the user" + err.message)
    }
}); 


connectDB()
.then(() => {
    console.log('Database connection established');
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
}
).catch((err) => {
    console.log('Error connecting to database', err.message);
}
);



