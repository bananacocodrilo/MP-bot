let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let UserSchema = new Schema({
  chatId: {
    type: String,
    required: true
  },  
  username: {
    type: String
  },  
  firstName: {
    type: String
  },
  realm: {
    type: String
  },
  lastMessage: {
    type: Date,
    default: Date.now
  },
  couponsRequests:{
    type: Number    
  },
  subscribed:{
    type: Boolean,
    default: true    
  },
  suggestions:{
    type:[{}]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


module.exports = mongoose.model('User', UserSchema);
