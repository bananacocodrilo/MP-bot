'use strict';
const config = require('../config.js');
// const bot = new TelegramBot(config.token, {polling: true});

let mongoose = require('mongoose');
let Coupon = mongoose.model('Coupon');
let User = mongoose.model('User');

let checkAdmin = require('../src/chatFunctions').checkAdmin;


let fs = require('fs');
let request = require('request');
let cheerio = require('cheerio');

const urlCodes = 'https://www.myprotein.es/voucher-codes.list';
const urlDiscounts = 'https://www.myprotein.es/our-range/clearance-shop.list';


exports.test = function(msg, match, callback) {  
  checkAdmin(msg)
  .then(() => { 
    request(urlCodes, function(error, response, html) {
      if(!error){
        var $ = cheerio.load(html);
        var messages = [];
        
        $('.voucher-container').each(function(){
          let newCoupon = {}
          let message = ''; 
          let code = $(this).find('.voucher-code').text();
          let desc = $(this).find('.voucher-title').text();
          if(code && desc){
            Coupon.find({
              value: code, 
              endsAt: { $gte: Date.now() }
            }).then(exists =>{
              if(!exists.length){
                  message = +'New code created: \n'+ code +':'+ desc;
                  newCoupon = {
                    value: code,
                    order: 3,
                    startsAt: new Date(),
                    endsAt: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
                    descriptionEs: desc
                  };
                  Coupon.create(newCoupon);
              
              } else if(exists.length && exists[0].descriptionEs !== desc){

                message += 'Found existint code '+ code + 
                      ' but descriptions dont match:\n'+desc+'\n'+exists.descriptionEs;
                      console.log(message);
              }
              messages.push(message)
                // bot.sendMessage(config.adminId, message, config.basicOptions);
            });
          }
        });
      }
      //TODO: no mandar esto vacio antes de que acabe el parser
      callback(messages);
    });
  })
  .catch((e)=>{
    console.log(e)
    callback('erroooor' + e);
  });
}
