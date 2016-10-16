const mongoose = require('mongoose');
const {Schema} = mongoose;

const MovieSchema = new Schema({
  title: {
    type: String,
    require: true
  },
  year: {
    type: String,
    require: true
  }
});

module.exports = mongoose.model('Movie', MovieSchema);
