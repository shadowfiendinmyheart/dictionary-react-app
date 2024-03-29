const {Schema, model} = require('mongoose');

const User = new Schema({
  nickname: {type: String, required: true},
  login: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  dictionaries: [{type: Schema.Types.ObjectId, ref:"Dictionary"}]
})

module.exports = model('User', User);