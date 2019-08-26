const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const userRouter = require('./users/user-router');
const authRouter = require('./auth/auth-router');

const server = express();

const sessionConfig = {
    name: 'Polarbear',
    secret: 'polarbearsliveinthearctic',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60,
      secure: false,
      httpOnly: true
    },
    store: new KnexSessionStore({
      knex: require('./data/dbConfig'),
      tablename: 'sessions',
      sidfieldname: 'sid',
      createtable: true,
      clearInterval: 1000 * 60 * 60
    })
  };
  
server.use(session(sessionConfig));
server.use(helmet());
server.use(express.json());
server.use(cors());


server.use('/api/users', userRouter);
server.use('/api', authRouter);

server.get('/', (req, res) => {
    res.json({api: 'API is working'});
});
  
  module.exports = server;