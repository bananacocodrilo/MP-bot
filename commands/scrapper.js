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


exports.syncCodes = function( bot) {  
  request(urlCodes, function(error, response, html) {
    if(!error){
      var $ = cheerio.load(html);
      
      $('.voucher-container').each(function(){
        let newCoupon = {};
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
            }

            bot.sendMessage(config.adminId, message, config.basicOptions);
          });
        }
      });
    }
  });
};





exports.syncVoucher = function( bot) {  
  request(urlDiscounts, function(error, response, html) {
    if(!error){
      var $ = cheerio.load(html);

      $('.productListDescription_text').each(function(){
        
        var p = $(this).find("p");
        var description  = p[1];
        var texts = $(description).find("span");
        var desc = $(texts[1]).text();
        var b = $(texts[0]).find("b");
        var code = $(b[2]).text();

        if(code && desc){

          
          Coupon.find({
            type: 'voucher'
          }).then(current =>{
            console.log(current.length)
            if(current.length && current[0].value === code){
              bot.sendMessage(config.adminId, 'Voucher hasnt change', config.basicOptions);
            }else{
              
              if(!current.length){
                bot.sendMessage(config.adminId, 'No voucher found', config.basicOptions);
              }else{
                Coupon.remove({type: 'voucher'});
              }  
              
              
              let newCoupon = {
                value: code,
                order: 4,
                type: 'voucher',
                startsAt: new Date(),
                endsAt: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
                descriptionEs: desc
              };
              Coupon.create(newCoupon);
              
              bot.sendMessage(config.adminId, 'Created new ' +code +' : '+ desc, config.basicOptions);
              
            }
          });
          
        }else{
          bot.sendMessage(config.adminId, 'Error parsing voucher', config.basicOptions);
        }
      });
    }
  });
};

