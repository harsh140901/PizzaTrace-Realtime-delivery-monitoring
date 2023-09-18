const LocalStratergy = require('passport-local').Strategy;
const User = require('../models/user');
const bcrypt = require('bcrypt');
function init(passport){

  passport.use(new LocalStratergy({usernameField : 'email'},async (email,password,done)=>{
    //Login

    // check email exists
    const user = await User.findOne({email : email});

    if(!user){
      return done(null,false,{message : "No user with this email"});
    }

    bcrypt.compare(password,user.password).then(match => {

      if(match)
      {
        return done(null,user,{message : "Logged in succesfully"});
      }
      else
      {
        return done(null,false,{message : "Incorrect username or password"});
      }
    }).catch( err =>{
      return done(null,false,{message : "Something went wrong"});
    });

  }));

  passport.serializeUser((user,done) => {

    done(null,user._id);
  });

  passport.deserializeUser((id,done) => {

    User.findById(id)
    .then((user) => {
      if(user){
        done(null,user);
      }
    }).catch((error)=>{
      console.log('error:' , error);
    });
    
  });

}

module.exports = init;