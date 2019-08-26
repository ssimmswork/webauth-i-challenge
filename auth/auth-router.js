const bcrypt = require('bcryptjs');
const Users = require('../users/user-model');
const router = require('express').Router();

router.post('/register', (req,res) => {
    console.log("message    ", req.body) //test
    let user = req.body;
    console.log("user   ",user) //test
    const hash = bcrypt.hashSync(user.password, 12);
    user.password = hash;

    Users.add(user)
        .then(newUser => {
            res.status(201).json(newUser);
        })
        .catch(err => {
            res.status(500).json({message: 'Unable to create a new user'});
        });
});

router.post('/login', (req,res) => {
    let {username, password} = req.body;
    req.session.loggedin = false;

    Users.findBy({username})
         .first()
         .then(user => {
             if(user && bcrypt.compareSync(password, user.password)){
                 req.session.loggedin = false;
                 res.status(200).json(`Welcome ${user.username}`);                    
             }
             else{
                 res.status(401).json({message: 'Unable to locate page'});
             }
         })
         .catch(err => {
            res.status(500).json({message: 'Unable to Authenticate'})
         });
});

router.delete('/logout', (req,res) => {
    console.log('logout  ', req.session) //test
    if(req.session){
        req.session.destroy((err) => {
            if (err){
                res.status(400).send('Unable to logout');
            }
            else{
                res.send('Logged Out');
            }
        });
    }
    else{
        res.end();
    }
});

module.exports = router;                                                                     