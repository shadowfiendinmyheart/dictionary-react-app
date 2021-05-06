const {Schema, model} = require('mongoose');

const schema = new Schema ({
    word: {type: String, required: true, unique: true}
})

module.exports = model('RusWord', schema);