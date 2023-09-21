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
      
        order.save()
        .then((result) => {
          return Order.populate(result, { path: 'customerId' });
        })
        .then((placedOrder) => {
          req.flash('success', 'Order placed successfully');
          delete req.session.cart;
          // Emit
          const eventEmitter = req.app.get('eventEmitter');
          eventEmitter.emit('orderPlaced', placedOrder);
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
        
      },

      async show(req, res) {
        try {
          const order = await Order.findById(req.params.id);
      
          if (!order) {
            // Handle the case where the order with the given ID does not exist.
            return res.status(404).send('Order not found');
          }
      
          if (req.user.id.toString() === order.customerId.toString()) {
            // Render the customer's order details using a view engine (e.g., EJS, Pug).
            return res.render('customers/singleOrder', { order });
          }
      
          // Redirect to the homepage or another appropriate route.
          return res.redirect('/');
        } catch (error) {
          console.error(error);
          // Handle other potential errors, such as database errors.
          return res.status(500).send('Internal Server Error');
        }
      }
  }
}

module.exports = orderController;