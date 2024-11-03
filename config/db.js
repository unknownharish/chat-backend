require('dotenv').config("../")

const mongoose = require("mongoose")
const connect = () => {
    try {

        mongoose.connect(process.env.MONGO_URL).then(x => {
            console.log("db connected")
        })
    } catch (error) {
        console.log("error in connecting", error)
    }

}

module.exports = connect

