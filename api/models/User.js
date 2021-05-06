const {Schema, model} = require('mongoose');

const schema = new Schema ({
  token: {type: String, unique: true},
  nickname: {type: String, required: true, unique: true},
  login: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  words: [{
    word: {type: Schema.Types.ObjectId, ref: 'EngWord'},
    status: {type: String, required: true, default:"watched"},
    date: {type: Date, required: true, default: Date.now}
  }]
})

module.exports = model('User', schema);