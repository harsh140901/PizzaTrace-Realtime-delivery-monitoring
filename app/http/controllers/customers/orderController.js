const Order = require('../../../models/order');
const moment = require('moment');
const { validationResult } = require('express-validator');
function orderController(){

  return {
    
      store(req,res){

        // Validate request
        const { address, phone } = req.body;

        // Validation using express-validator (requires setup)
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          req.flash('error', 'Validation errors: ' + errors.array().map(error => error.msg).join(', '));
          return res.redirect('/cart');
        }


        const order = new Order({
          customerId: req.user._id,
          items: req.session.cart.items,
          phone,
          address,
        });
      
        order
          .save()
          .then(() => {
            req.flash('success', 'Order placed successfully');
            delete req.session.cart;
            return res.redirect('/customer/orders');
          })
          .catch((err) => {
            console.error(err);
            req.flash('error', 'Something went wrong');
            return res.redirect('/');
          });
      
      },

      async index(req,res){

        const orders = await Order.find({customerId : req.user._id},
          null,{sort : {'createdAt' : -1}});
        res.render('customers/order', {orders : orders,moment : moment});
        
      }
  }
}

module.exports = orderController;