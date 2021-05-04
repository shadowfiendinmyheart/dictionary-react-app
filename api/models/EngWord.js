const {Schema, model, Types} = require('mongoose');

const schema = new Schema ({
    word: {type: String, required: true, unique: true},
    translations: [{type: Types.objectId, ref: 'RusWord'}],
})

module.exports = model('EngWord', schema);