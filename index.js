const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const db = require('./data/dbConfig');
const restricted = require('./auth/authentication');
const Users = require('./users/user-model');

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

server.get('/', (req,res) => {
    res.send('alive');
})

server.post('/api/register', (req,res) => {
    let user = req.body;

    const hash = bcrypt.hashSync(user.password);
    user.password = hash;

    Users.add(user)
        .then(saved => {
            res.status(201).json(saved);
        })
        .catch(error => {
            res.status(500).json(error);
        })
});

server.post('/api/login', (req,res) => {
    let {username,password} = req.body;

    Users.findBy({username})
        .first()
        .then(user => {
            if(user && bcrypt.compareSync(password, user.password)){
                res.status(200).json({message: `Welcome ${user.username}`});
            }
            else{
                res.status(401).json({message: 'Invalid Credentials'});
            }
        })
        .catch(error => {
            res.status(500).json(error)//
        })
});

server.get('api/users', (req,res) => {
    console.log('users')
    Users.find()
        .then(users => {
            console.log('users')
            res.json(users);
        })
        .catch(err => res.send(err));
});

server.get('/', restricted, (req,res) => {
    res.send('restricted');
});

server.post('/hash', (req,res) => {
    const password = req.body.password;
    const hash = bcrypt.hashSync(password, 12);

    res.status(200).json({password, hash})
});

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`\n** Running on port ${port} **\n`));
