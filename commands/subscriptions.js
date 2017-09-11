'use strict';
const config = require('../config.js');
let mongoose = require('mongoose');
let User = mongoose.model('User');



exports.subscribe = function(msg, match) {
  return new Promise (function(resolve, reject){
    User.update({ 'chatId': msg.chat.id }, { $set: {subscribed: true}})
    .then(() => {
      resolve('Recibido, te avisare cuando haya nuevos cupones.');
    })
    .catch( err => {
      reject(err+'');
    });
  })
};

exports.unsubscribe = function(msg, match) {
  return new Promise (function(resolve, reject){
    User.update({ 'chatId': msg.chat.id }, { $set: {subscribed: false}})
    .then(() => {
      resolve('Okey makey no te molesto mas. Puedes volver a subscribirte cuando quieras.');
    })
    .catch( err => {
      reject(err+'');
    });
  });
}
