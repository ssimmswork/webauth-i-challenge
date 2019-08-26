const bcrypt = require('bcryptjs');
const Users = require('../users/user-model');

function restricted(req, res, next){
    let {username,password} = req.headers;

    if(req.session && (req.session.loggedin === true)){
       next();            
    }
    else{
        res.status(400).json({message: 'Please provide valid credentials'})
    }
};

module.exports = restricted;