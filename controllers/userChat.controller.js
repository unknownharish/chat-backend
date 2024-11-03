const userChatService = require("../services/userChat.service");

class userChatController { }




userChatController.Register = async (req, res) => {

    try {
        const { username: userName, password, email } = req.body;

        const registerUser = await userChatService.createUser({ userName, password, email })

        if (registerUser) {
            res.status(201).json({ message: "User registered" });
        }
        else
            res.status(400).json({ message: "Bad request" });


    } catch (error) {
        console.log("error is", error)
        res.status(500).json({ message: "Internal server error" });
    }

}

userChatController.Login = async (req, res) => {
    const { email, password } = req.body;
    const existingUser = await userChatService.verifyUser({ email, password })
    if (existingUser)
        res.json({ token: existingUser });
    else
        res.status(401).json({ error: "Invalid Credentials" });


}

module.exports = userChatController