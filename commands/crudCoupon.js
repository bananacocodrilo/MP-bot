'use strict';
const config = require('../config.js');
let mongoose = require('mongoose');
let Coupon = mongoose.model('Coupon');
let User = mongoose.model('User');
let generateCouponsString = require('../src/chatFunctions').generateCouponsString;

exports.createCoupon = function(msg, match, callback) {  
  let counponData =  JSON.parse(msg.text.slice( 10 ).trim());
  
  checkAdmin(msg)
    .then(() => { 
      return  Coupon.create(counponData);
    })
    .then(() => {
      callback('Hecho');
    })
    .catch( err => {
      console.log(err);
      callback(err+'');
    });
}

exports.updateCoupon = function(msg, match, callback) {  
  let counponData =  JSON.parse(msg.text.slice( 13 ).trim());
  let id = counponData.value;
  delete counponData.value;
  
  checkAdmin(msg)
    .then(() => { 
      return Coupon.update({ 'value': id }, 
        { $set: counponData});
    })
    .then((a) => {
      callback(JSON.stringify(a));
    })
    .catch( err => {
      console.log(err)
      callback(err+'');
    });
};

exports.deleteCoupon = function(msg, match, callback) {
  checkAdmin(msg)
    .then(() => { 
      return  Coupon.remove({"value":match[1]});
    })
    .then(() => {
      callback('Hecho');
    })
    .catch( err => {
      console.log(err)
      callback(err+'');
    });
};

exports.notifyChanges = function(msg, match, callback) {
  let users  = []
  let couponsArray = [];
  let msgEs = '';
  let msgEn = '';

  checkAdmin(msg)
    .then(() => { 
      return  User.find({"subscribed":true});
    })
    .then((usersArray) => {
      users = usersArray;
      return  Coupon.find({'endsAt': { $gte: Date.now() }}, null, 
        {'sort': { 'order': 1 }});
    }) 
    .then((coupons) => {
       couponsArray = coupons;
      return generateCouponsString(couponsArray, 'es');
    })
    .then((stringEs) => {
      msgEs = stringEs;
      return generateCouponsString(couponsArray, 'en');
    })
    .then((stringEn) => {
      msgEn = stringEn;
      callback(users, msgEs, msgEn);
    })
    .catch( err => {
      console.log(err)
      callback(err+'');
    });
    
}
        

exports.listUsers = function(msg, match, callback) {
  let users  = [];
  let response = '';

  checkAdmin(msg)
    .then(() => { 
      return  User.find({});
    })
    .then((usersArray) => {
      for (var index = 0; index < usersArray.length; index++) {
        let user = usersArray[index];
        response += '\n' + user.id + ': '+ user.subscribed;
      }
      
      callback(response);
    })
    .catch( err => {
      console.log(err)
      callback(err+'');
    });
    
}
        



function checkAdmin(msg){
  return new Promise (function(resolve, reject){
    if(msg.chat.id+'' === config.adminId){
      resolve();
    }else{
      reject('This command is reserver for admins only');
    }
  });
}
