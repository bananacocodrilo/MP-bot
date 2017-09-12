'use strict';
const config = require('../config.js');
let mongoose = require('mongoose');
let User = mongoose.model('User');

const bottomRow = ['/suggest','/about','/help'];
const adminRow = ['/users','/notify','/test'];

module.exports.calculateKeyboardOptions = function(msg){
  let options = {
    "parse_mode": config.basicOptions.parse_mode,
    "reply_markup": {  "keyboard": []  }
  };
  
  return new Promise (function(resolve, reject){
    User.find({chatId:msg.chat.id}, function(err, info){
      let userInstance = info[0];
      let topRow = ['/list', '/unsubscribe'];
      if(userInstance && !userInstance.subscribed){
        topRow = ['/list', '/subscribe'];
      }
      options.reply_markup.keyboard = [topRow, bottomRow];

      if(msg.chat.id == config.adminId){
        options.reply_markup.keyboard.push(adminRow);
      }
      resolve(options);
    });

  });
};




module.exports.generateCouponsString = function(coupons, language){
  return new Promise (function(resolve, reject){
    let response = '';

    if(coupons.length === 0){
      if(language === 'es'){
        response = 'Actualmente no hay ningun código activo';
      }else{
        response = 'There is not active codes at this moment';
      }
    }else {
      response = 'Lista de códigos:';

      for (let index = 0; index < coupons.length; index++) {
        let coupon = coupons[index];
        response += '\n\n *' + coupon.value + ':*';
        
        if(language === 'en' && 
          coupon.hasOwnProperty('descriptionEn') &&
          coupon.descriptionEn.length){
            response += '\n    ' + coupon.descriptionEn;
          }else{
            response += '\n    ' + coupon.descriptionEs;
          }
      }
    }
    resolve(response);
  });
}



module.exports.checkAdmin = function (msg){
  return new Promise (function(resolve, reject){
    if(msg.chat.id+'' === config.adminId){
      resolve();
    }else{
      reject('This command is reserver for admins only');
    }
  });
}
