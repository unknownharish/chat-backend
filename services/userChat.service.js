const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const user = require("../config/schema/user");
require('dotenv').config("../")


class userChatService { }





userChatService.createUser = async ({ userName, password, email }) => {

    try {
        let registerUser = new user({ userName, password, email });
        await registerUser.save();
        return { data: registerUser }

    } catch (error) {
        console.log("inside create", error)
    }
}


userChatService.getById = async (id) => {

    try {
        let userData = await user.find({ _id: id })
        return { user: userData }

    } catch (error) {
        console.log("inside find", error)
    }
}

userChatService.verifyUser = async ({ email, password }) => {

    try {
        let validUser = await user.findOne({ email })
        if (!validUser || !(await bcrypt.compare(password, validUser.password))) {
            console.log("incorrect pass", await bcrypt.compare(password, validUser?.password))
            return false
        }

        const token = jwt.sign({
            id: validUser._id,
            userName: validUser.userName
        }, process.env.ENC_HASH_JWT,
            { expiresIn: '1h' }
        );

        return token;
    } catch (error) {
        console.log("inside create", error)
        return false
    }
}


module.exports = userChatService