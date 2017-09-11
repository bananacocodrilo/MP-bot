'use strict';
let mongoose = require('mongoose');
const config = require('../config.js');

let Coupon = mongoose.model('Coupon');
let generateCouponsString = require('../src/chatFunctions').generateCouponsString;


exports.getCoupons = function(msg, match) {
  return new Promise (function(resolve, reject){
    Coupon.find({
      'endsAt': { $gte: Date.now() }
      }, null, {'sort': { 'order': 1 }}) 
      .then((coupons) => {
        return generateCouponsString(coupons, msg.from.language_code);
      })
      .then((couponsString) => {
        resolve(couponsString);
      })
      .catch( err => {
        reject(err);
      });
    });
};

