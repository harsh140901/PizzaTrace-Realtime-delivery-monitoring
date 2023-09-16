const express = require('express'); 
const app = express();
const ejs = require('ejs');
const expressLayout = require('express-ejs-layouts');
const path = require('path');
// Port for server including live server
const PORT = process.env.PORT || 5000;


// Assets
app.use(express.static('Public'));

// set template engine 
app.use(expressLayout);
app.set('views' ,path.join(__dirname,'/resources/views'));
app.set('view engine' , 'ejs');

// routes
app.get('/', (req,res) => {
  res.render('home');
});

app.get('/cart', (req,res) => {
  res.render('customers/cart');
});

app.get('/login', (req,res) => {
  res.render('auth/login');
});

app.get('/register', (req,res) => {
  res.render('auth/register');
});
// making server to listen request from client
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
