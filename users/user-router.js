const router = require('express').Router();

const Users = require('./user-model');

const restricted = require('../auth/authentication');

router.get('/', restricted, (req, res) => {
    Users.find()
         .then(users => {
             res.send(users);
         })
         .catch(err => {
            res.status(404).json({message: 'Record not found'});
         });
});

module.exports = router;