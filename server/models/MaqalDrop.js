const mongoose = require('mongoose');

const MaqalDropSchema = new mongoose.Schema({
    sentence: {
        type: String,
        required: true },
    level: {
        type: Number,
        required: true
    }
});

const MaqalDrop = mongoose.models.MaqalDrop || mongoose.model('MaqalDrop', MaqalDropSchema);

module.exports = MaqalDrop;