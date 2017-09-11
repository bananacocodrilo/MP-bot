let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let UserSchema = new Schema({
  chatId: {
    type: String,
    required: true
  },
  lastMessage: {
    type: Date,
    default: Date.now
  },
  messagesNumber: {
    type: Number
  },
  couponsRequests:{
    type: Number    
  },
  subscribed:{
    type: Boolean,
    default: true    
  },
  messages:{
    type:[{}]
  }
});


module.exports = mongoose.model('User', UserSchema);
