'use strict';
const config = require('../config.js');
let request = require('request');
let cheerio = require('cheerio');
let mongoose = require('mongoose');

let Coupon = mongoose.model('Coupon');
let User = mongoose.model('User');

let checkAdmin = require('../src/chatFunctions').checkAdmin;

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

              message += 'Encontrado un cupon que ya existia '+ code + 
                    ' Pero las descripciones no cuadran: \n->'+desc+'\n->'+exists.descriptionEs;
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
        var description  = p[2];
        var texts = $(description).find("span");
        var desc = $(texts[1]).text();
        var b = $(texts[0]).find("b");
        let code = null;

        for (let i = 0 ;i< b.length; i++){
          let temp = $(b[i]).text();
          
          if (temp.length === 9 &&
            temp === temp.toUpperCase()){
              code = temp;
              break;
          }
        }
        if(code && desc){
          Coupon.find({
            type: 'voucher'
          }).then(current =>{
            if(current.length && current[0].value === code){
              bot.sendMessage(config.adminId, 'Voucher hasnt change', config.basicOptions);
            }else{
              if(!current.length){
                bot.sendMessage(config.adminId, 'No voucher found', config.basicOptions);
              }else{
                Coupon.remove({type: 'voucher'}, function(err, info){});
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

