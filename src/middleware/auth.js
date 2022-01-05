const jwt = require('jsonwebtoken')
const User= require('../models/user');
const auth = async (req,res,next) => {
    // console.log('Auth middleware');
    // next()  // if no next, when we call it, it just work util this call, no further execute the other
    
    try{
        // Need an Authorization in Header of postman that fill with the token (set in environment and each of the methods)
        const token = req.header('Authorization').replace('Bearer ', '')    //we remove the 'Bearer ' to get our Token
        // console.log(token);
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        // console.log(decoded);
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token})
        // console.log(user);
        if (!user){
            throw new Error()
        }
        req.token = token
        req.user = user
        next()
    }catch(e){
        res.status(401).send({error: 'Please authenticate'})
    }
}

module.exports = auth