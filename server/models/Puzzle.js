const mongoose = require('mongoose');

const puzzleSchema = new mongoose.Schema({
    level: {
        type: Number,
        required: true,
    },
    wordPairs: [
        {
            part1: {
                type: String,
                required: true,
            },
            part2: {
                type: String,
                required: true,
            },
        }
    ],
});

const Puzzle = mongoose.model('Puzzle', puzzleSchema);

module.exports = Puzzle;
