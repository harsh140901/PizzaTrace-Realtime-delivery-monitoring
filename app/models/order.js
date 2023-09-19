const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new mongoose.Schema({

  customerId : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'User',
    required : true
  },

  items : {type : Object, required : true},
  phone : {type : String},
  address : {type : String},
  paymentType : {type : String, default : 'COD'},
  status : {type : String, default : 'order-placed'}

},{timestamps : true});

module.exports = mongoose.model('Order',orderSchema);