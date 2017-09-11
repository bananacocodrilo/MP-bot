let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let SuggestionSchema = new Schema({
  chatId: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


module.exports = mongoose.model('Suggestion', SuggestionSchema);
