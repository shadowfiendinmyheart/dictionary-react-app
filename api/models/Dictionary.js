const {Schema, model} = require('mongoose');
const Word = new Schema( {
    word: {type: String, unique: true, index: true},
    translations: {type: [String], index: true},
    imageURL: {type: String, required: true},
    counter: {type: Number, default: 0},
    date: {type: Date, required: true, default: Date.now}
});

const Dictionary = new Schema ({
    language: {type: String, required: true, default:"eng"},
    ownerId: {type: Schema.Types.ObjectId,ref:"User"},
    words: [Word]
});
module.exports = model('Dictionary', Dictionary);