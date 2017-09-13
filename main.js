'use strict';
let mongoose = require('mongoose');
const TelegramBot = require('node-telegram-bot-api');

const config = require('./config.js');
const userAct = require('./src/usersActivity');
const models = require('./models');
const commands = require('./commands');


const bot = new TelegramBot(config.token, {polling: true});
const calculateKeyboardOptions = require('./src/chatFunctions').calculateKeyboardOptions;


mongoose.Promise = global.Promise;
mongoose.connect(config.mongoConnectionString, {useMongoClient: true}); 



// Admin messages
bot.onText(/\/newCoupon (.+)/, (msg, match) => {
  commands.createCoupon(msg, match, function(response){
    bot.sendMessage(msg.chat.id, response, config.basicOptions);
  });
});
bot.onText(/\/updateCoupon (.+)/, (msg, match) => {
  commands.updateCoupon(msg, match, function(response){
    bot.sendMessage(msg.chat.id, response, config.basicOptions);
  });
});
bot.onText(/\/deleteCoupon (.+)/, (msg, match) => {
  commands.deleteCoupon(msg, match, function(response){
    bot.sendMessage(msg.chat.id, response, config.basicOptions);
  });
});
bot.onText(/\/users/, (msg, match) => {
  commands.listUsers(msg, match, function(response){
    bot.sendMessage(msg.chat.id, response, config.basicOptions);  
  });
});
bot.onText(/\/notify/, (msg, match) => {
  commands.notifyChanges(msg, match, function(users, msgEs, msgEn){
    // console.log('Llega');
    users.forEach(function(user) {
        bot.sendMessage(user.chatId, msgEs, config.basicOptions);  
    }, this);

    bot.sendMessage(msg.chat.id, 'Enviadas ' +users.length + ' notificaciones.');
  });
});
bot.onText(/\/test/, (msg, match) => {
  commands.test(bot, function(response){
    bot.sendMessage(msg.chat.id, response, config.basicOptions);
  });
});




// Basic bot messages
bot.onText(/\/list/, (msg, match) => {
  let response = '';  
  commands.getCoupons(msg, match)
    .then((res) => {
      response = res;
      return calculateKeyboardOptions(msg, 'list');
    })
    .then((options) => {
      bot.sendMessage(msg.chat.id, response, options);  
    })
    .catch( err => {
      bot.sendMessage(msg.chat.id, err);  
    });
});
bot.onText(/\/subscribe/, (msg, match) => {
  let response = '';
  commands.subscribe(msg, match)
    .then((res) => {
      response = res;
      return calculateKeyboardOptions(msg, 'subscribe');
    })
    .then((options) => {
      bot.sendMessage(msg.chat.id, response, options);  
    })
    .catch( err => {
      bot.sendMessage(msg.chat.id, err);  
    });
});
bot.onText(/\/unsubscribe/, (msg, match) => {
  let response = '';
  commands.unsubscribe(msg, match)
    .then((res) => {
      response = res;
      return calculateKeyboardOptions(msg, 'unsubscribe');
    })
    .then((options) => {
      bot.sendMessage(msg.chat.id, response, options);  
    })
    .catch( err => {
      bot.sendMessage(msg.chat.id, err);  
    });
});



// Help and welcome
bot.onText(/\/start/, (msg, match) => {
  help(msg);
});
bot.onText(/\/help/, (msg, match) => {
  help(msg);
});
bot.onText(/\/about/, (msg, match) => {
  calculateKeyboardOptions(msg, 'about')
    .then((options) => {
      bot.sendMessage(msg.chat.id, 'En desarrollo: crawler para detectar nuevos cupones automaticamente \n Siguiente: Añadir otras webs y dar la opcion de subscribirse a una o varias.', options);  
    })
    .catch( err => {
      bot.sendMessage(msg.chat.id, err+'');  
    });
});


function help(msg){
  let response = config.helpMessage;

  userAct.userUpsert(msg)
  .then((user) => {
    if(user === null){
      bot.sendMessage(config.adminId, 'New user!');    
    }
    return calculateKeyboardOptions(msg, 'help');
  })
  .then((options) => {
    bot.sendMessage(msg.chat.id, response, options);
  })
  .catch( err => {
    bot.sendMessage(msg.chat.id, err+'');  
  });
} 

commands.syncCodes(bot);
setInterval(() => {
  commands.syncCodes(bot);
}, 1000*60*60*2);

commands.syncVoucher(bot);
setInterval(() => {
  commands.syncVoucher(bot);
}, 1000*60*60*2);