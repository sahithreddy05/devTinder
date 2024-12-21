const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user');
const app = express();
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");

app.use(express.json());


app.post("/signup", async (req, res) => {
    // console.log(req.body);

    try {
        // Validation of data
        validateSignUpData(req);
        const { firstName, lastName, emailId, password } = req.body;
        // Encrypt the password
        const passwordHash = await bcrypt.hash(password, 10);
        console.log(passwordHash);
        //   Creating a new instance of the User model
        const user = new User({
          firstName,
          lastName,
          emailId,
          password: passwordHash,
        });
    await user.save();
    res.send("user added successfully");
    }catch(err){
        res.status(400).send("ERROR : " + err.message);
    }
}); 

app.post("/login", async (req, res) => {
    try {
      const { emailId, password } = req.body;
      const user = await User.findOne({ emailId: emailId });
      if (!user) {
        throw new Error("Invalid credentials");
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        res.send("Login Successful!!!");
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (err) {
      res.status(400).send("ERROR : " + err.message);
    }
  });


// get user by email
app.get("/user", async (req, res) => {
    const email = req.body.emailId;
    try{
    const user = await User.find({emailId: email});

        if(user.length === 0){
            res.status(404).send("User not found");
        }else{
            res.send(user);
        }
    }
    catch(err){
        res.status(400).send("Error finding the user" + err.message)
    }

});

// get all users
app.get("/feed", async (req, res) => {

    const email = req.body.emailId;
    try{
    const users = await User.find({});
    res.send(users);
    }
    catch(err){
        res.status(400).send("Error finding the user" + err.message)
    }

}
);


app.delete("/user", async (req, res) => {

    const userId = req.body.userId;
    try{
        const user = await User.finfByIdAndDelete(userId);
    }catch(err){
        res.status(400).send("Error deleting the user" + err.message)
    }
});


app.patch("/user/:userId", async (req, res) => {
    
        const userId = req.params?.userId;
        const data = req.body;
        try{
            const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];
            const isUpdateAllowed = Object.keys(data).every((k) =>
            ALLOWED_UPDATES.includes(k)
            );
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }
    if (data?.skills.length > 10) {
      throw new Error("Skills cannot be more than 10");
    }
            const user = await User.findByIdAndUpdate(userId, data, {
                returnDocument: 'after',
                runValidators: true,
            });
            res.send(user);
        }catch(err){
            res.status(400).send("Error Updating the user" + err.message)
        }
    }
    );

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



