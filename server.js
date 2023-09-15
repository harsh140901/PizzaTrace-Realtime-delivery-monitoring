const express = require('express'); 
const app = express();
const ejs = require('ejs');
const expressLayout = require('express-ejs-layouts');
const path = require('path');
// Port for server including live server
const PORT = process.env.PORT || 3000;

app.get('/', (req,res) => {
  res.render('home');
});


// set template engine 
app.use(expressLayout);
app.set('views' ,path.join(__dirname,'/resources/views'));
app.set('view engine' , 'ejs');

// making server to listen request from client
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
