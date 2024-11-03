const mongoose = require("mongoose")

const message = mongoose.Schema({

    msgType: {
        type: String,
        require: true
    },
    filePath: {
        type: String,
        trim: true
    },
    text: {
        type: String,
    },
    to: {
        type: mongoose.Types.ObjectId,
    },
    from: {
        type: mongoose.Types.ObjectId,
    },
}, {
    timestamps: true
})


const chatType = mongoose.Schema({

    msg: [message],
    userId: {
        type: mongoose.Types.ObjectId,
    },
    partnerId: {
        type: mongoose.Types.ObjectId,
    }

}, {
    timestamps: true
})



module.exports = mongoose.model("allchats", chatType)


