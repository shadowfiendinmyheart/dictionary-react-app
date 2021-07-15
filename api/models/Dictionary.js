const {Schema, model} = require('mongoose');

const schema = new Schema ({
    language: {type: String, required: true, default:"eng"},
    ownerId: {type: Schema.Types.ObjectId,ref:"User"},
    words: [{
        word: {type: String, unique: true, index: true},
        translations: {type: [String], index: true},
        imageURL: {type: String, required: true},
        status: {type: String, required: true, default:"watched"},
        date: {type: Date, required: true, default: Date.now}
    }]
})
module.exports = model('Dictionary', schema);