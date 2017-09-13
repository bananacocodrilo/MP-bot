let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let CouponSchema = new Schema({
  value: {
    type: String,
    required: true,
    unique: true
  },
  order: {
    type: Number,
    required: true
  },
  startsAt: {
    type: Date,
    required: true
  },
  endsAt: {
    type: Date,
    required: true
  },
  descriptionEs:{
    type: String,
    required: true    
  },
  descriptionEn:{
    type: String    
  },
  incidences:{
    type:[{}]
  },
  type:{
    type: String
  }
});


module.exports = mongoose.model('Coupon', CouponSchema);
