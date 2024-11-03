require('dotenv').config("../")
const jwt = require("jsonwebtoken")

const authenticate = (authToken) => {
    try {
        const token = authToken?.split(' ')[1];
        if (!token) return false;

        const decoded = jwt.verify(token, process.env.ENC_HASH_JWT)
        console.log(decoded, "decoded")
        return decoded
    } catch (error) {
        console.log('error', error)
        return false
    }
};



module.exports = {
    authenticate
}