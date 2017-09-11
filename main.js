'use strict';
let mongoose = require('mongoose');
const TelegramBot = require('node-telegram-bot-api');

const config = require('./config.js');
const userAct = require('./src/usersActivity');
const models = require('./models');
const commands = require('./commands');


const token = config.token;
const bot = new TelegramBot(token, {polling: true});
const calculateKeyboardOptions = require('./src/chatFunctions').calculateKeyboardOptions;


mongoose.Promise = global.Promise;
mongoose.connect(config.mongoConnectionString, {useMongoClient: true}); 



// Admin messages
bot.onText(/\/newCoupon (.+)/, (msg, match) => {
  commands.createCoupon(msg, match, function(response){
    bot.sendMessage(msg.chat.id, response);
  });
});
bot.onText(/\/updateCoupon (.+)/, (msg, match) => {
  console.log('update');
  commands.updateCoupon(msg, match, function(response){
    bot.sendMessage(msg.chat.id, response);
  });
});
bot.onText(/\/deleteCoupon (.+)/, (msg, match) => {
  commands.deleteCoupon(msg, match, function(response){
    bot.sendMessage(msg.chat.id, response);
  });
});
bot.onText(/\/users/, (msg, match) => {
  commands.listUsers(msg, match, function(response){
    bot.sendMessage(msg.chat.id, response);
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
      bot.sendMessage(msg.chat.id, 'Proximo: Avisar a los usuarios subscritos cuando se cree algo nuevo', options);  
    })
    .catch( err => {
      bot.sendMessage(msg.chat.id, err+'');  
    });
});


function help(msg){
  let response = config.helpMessage;
  
  userAct.userUpsert(msg)
  .then(() => {
    return calculateKeyboardOptions(msg, 'help');
  })
  .then((options) => {
    bot.sendMessage(msg.chat.id, response, options);  
  })
  .catch( err => {
    bot.sendMessage(msg.chat.id, err+'');  
  });
} 