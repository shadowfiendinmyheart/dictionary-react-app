const {Schema, model} = require('mongoose');

const schema = new Schema ({
    word: {type: String, required: true, unique: true},
    translations: [{type: Schema.Types.ObjectId, ref: 'RusWord'}]
})

module.exports = model('EngWord', schema);