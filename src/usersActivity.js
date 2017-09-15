'use strict';
const User = require('../models').User;

module.exports.userUpsert = function(msg){
  return new Promise (function(resolve, reject){
    let query = {'chatId': msg.from.id};
    let update = { lastMessage: new Date() , username: msg.from.username, firstName: msg.from.firstName};
    let options = { upsert: true, new: false, setDefaultsOnInsert: true };

    User.findOneAndUpdate(query, update, options, 
      function(error, result) {
        if (error) {
          reject(error);
        }else{
          resolve(result);
        }
      });
  });
};

