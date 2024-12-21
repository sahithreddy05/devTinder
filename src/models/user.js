const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({

    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 50
    },
    lastName: {
        type: String,
    },
    emailId: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email is invalid");
        }
    },
},
    password: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
              throw new Error("Enter a Strong Password: " + value);
            }
          },
    },
    age: {
        type: Number,
        min: 18,
    },
    gender: {
        type: String,
        validate(value) {
            if (!["male", "female", "others"].includes(value)) {
                throw new Error("Gender is not valid");
            }
        }
    },
    photoUrl: {
        type: String,
        default: "https://www.shutterstock.com/image-vector/vector-design-avatar-dummy-sign-600nw-1290556063.jpg",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("URL is invalid");
        }
    },
},
    about: {
        type: String,
        default: "Hey there, here is a little about me!"
    },
    skills: {
        type: [String],
    },
}, { timestamps: true });



userSchema.methods.getJWT = async function() {

    const user = this;
    const token = await jwt.sign({ _id:user._id},"secretkey",{
        expiresIn: "7d",
    });
}


userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;
  
    const isPasswordValid = await bcrypt.compare(
      passwordInputByUser,
      passwordHash
    );
  
    return isPasswordValid;
  };

module.exports = mongoose.model("User", userSchema);


