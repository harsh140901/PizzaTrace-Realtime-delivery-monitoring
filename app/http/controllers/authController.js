const passport = require('passport');
const User = require('../../models/user');
const bcrypt = require('bcrypt');
function authController(){

  return {
    
    login(req,res){
      res.render('auth/login');
    },

    postLogin(req,res,next){
      passport.authenticate('local',(err,user,info) =>{

        if(err) 
        {
          req.flash('error',info.message);
          return next(err);
        }

        if(!user)
        {
          req.flash('error',info.message);
          return res.redirect('/login');
        }

        req.logIn(user,(err) => {
          if(err){
            req.flash('error',info.message);
            return next(err);
          }

          return res.redirect('/');
        });

      })(req,res,next);

    },

    register(req,res){
      res.render('auth/register');
    },

    async postRegister(req,res){
      const {name , email,password} = req.body;

      // fields validation
      if( !name || !email || !password)
      {
        req.flash('error','All fields are required');
        req.flash('name', name);
        req.flash('email', email);
        return res.redirect('/register');
      }

    // email existance validation
      
    User.findOne({ email: email })
     .then((user) => {
      if (user) {
        // A user with the provided email already exists
        req.flash('error', 'Email already exists');
        req.flash('name', name);
        req.flash('email', email);
        return res.redirect('/register');
      }
    })
    .catch((err) => {
      console.error(err); // You can log the error for debugging
      return res.status(500).send('Internal Server Error');
    });

      // Hashing password
      const hashedPassword = await bcrypt.hash(password,10);
      
      // Create new user
      const user = new User({
        name : name,
        email : email,
        password : hashedPassword
      })
      user.save().then((user) => {
        //Login

        return res.redirect('/');
      }).catch(err => {
        req.flash('error','Something went wrong');
        return res.redirect('/register');
      });

      console.log(req.body);
    },

    logout(req,res){
      // req.logout();
      // return res.redirect('/');

      req.logout((err) => {
        if (err) { return next(err); 
      }
      res.redirect('/');
      });
    }
  }
}

module.exports = authController;