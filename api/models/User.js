const {Schema, model, Types} = require('mongoose');

const schema = new Schema ({
  token: {type: String, unique: true},
  nickname: {type: String, required: true, unique: true},
  login: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  words: [{
    word: {type: Types.objectId, ref: 'EngWord'},
    status: {type: "learned"||"unlearned"||"watched", required: true},
    date: {type: Date, required: true},
  }],
})

module.exports = model('User', schema);