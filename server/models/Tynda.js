const mongoose = require('mongoose');

const tyndaSchema = new mongoose.Schema({
    word: {
        type: String,
        required: true
    },
    audioPath: {
        type: String,
        required: true
    }
});

module.exports = Tynda = mongoose.model('Tynda', tyndaSchema);
