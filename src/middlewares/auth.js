const jwt = require('jsonwebtoken');
const User = require('../models/user');

const userAuth = async (req, res, next) => {

    try{ 
    
    const {token} = req.cookies;
    if (!token) {
        return res.status(401).send("Please Login!");
      }

    const decodedObj = await jwt.verify(token , "secretkey");

    const {_id} = decodedObj;
    
    const user = await User.findById(_id);

    if(!user){
        throw new Error("User not found");
    } else {
    next();
    }
    
} catch(err){
    res.status(401).send("Unauthorized access " + err);
    }
};


module.exports = {
    userAuth,
};
