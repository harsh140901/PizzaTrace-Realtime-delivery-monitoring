require('dotenv').config();
const express = require('express'); 
const app = express();
const ejs = require('ejs');
const expressLayout = require('express-ejs-layouts');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('express-flash');
const passport = require('passport');
const MongoDbStore = require('connect-mongo')(session);


// Port for server including live server
const PORT = process.env.PORT || 3000;


// Database connection
const url = 'mongodb://127.0.0.1/pizza';
mongoose.connect(url,{useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;
mongoose.connection
    .once('open', function () {
      console.log('Database connected...');
    })
    .on('error', function (err) {
      console.log(err);
    });


//session store
let mongoStore = new MongoDbStore({
  mongooseConnection : connection,
  collection : 'session'
})

// session config
app.use(session({
  secret : process.env.COOKIE_SECRET,
  resave : false,
  store : mongoStore,
  saveUninitialized : false,
  cookie : {maxAge : 1000 * 60 *60 *24} // 24 hrs
}));

// passport config
const passportInit = require('./app/config/passport');
passportInit(passport);
app.use(passport.session());
app.use(passport.initialize()); 


// Assets
app.use(flash());
app.use(express.static('Public'));
app.use(express.urlencoded({extended : false}));
app.use(express.json());


// global middleware
app.use((req,res,next) => {
  res.locals.session = req.session;
  res.locals.user = req.user;
  next();
});


// set template engine 
app.use(expressLayout);
app.set('views' ,path.join(__dirname,'/resources/views'));
app.set('view engine' , 'ejs');

// routes
require('./routes/web')(app);


// making server to listen request from client
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
