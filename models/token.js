const mongoose = require("mongoose");
const { Schema } = mongoose; 

const tokenSchema = new Schema({
    _userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Usuario"
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
        expires: 43200
    }
});

const tokenModel = mongoose.model("Token", tokenSchema);
module.exports = tokenModel;