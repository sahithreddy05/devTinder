const jwt = require('jsonwebtoken');
const User = require('../models/user');

const userAuth = async (req, res, next) => {

    try{ 
    
    const {token} = req.cookies;

    const decodedObj = await jwt.verify(token , "secretkey");

    const {_id} = decodedObj;
    
    const user = await User.findById(_id);

    if(!user){
        throw new Error("User not found");
    }
    next();
    
} catch(err){
    res.status(401).send("Unauthorized access");
    }
};


module.exports = {
    userAuth,
};
