const mongoose = require("mongoose")
const { encrypt } = require("../../utils")
const user = mongoose.Schema({

    email: {
        type: String,
        required: true,
        unique: true,
        index:true
    },
    userName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        set: encrypt
    },

}, {
    timestamps: true
})



module.exports = mongoose.model("users", user)


