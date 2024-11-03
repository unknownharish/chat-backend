const bcrypt = require('bcrypt')
const multer = require('multer');
const path = require('path')


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const uploadFile = multer({ storage: storage });


const encrypt = function (plainText) {
    if (!plainText) {
        return plainText;
    }
    try {

        return bcrypt.hashSync(plainText, 10)

    } catch (e) {
        return plainText
    }
}

const comparePass = function (encText, userInput) {
    if (!encText) {
        return false;
    }
    try {
        return bcrypt.compareSync(userInput, encText)

    } catch (e) {
        return false
    }
}



const getUserPrimaryKey = (userId, userList) => {

    console.log("user list insdie", userList, userId)
    const userEntry = Object.values(userList).find(user => user.user._id === userId?.toString());
    return userEntry ? {
        _id: userEntry?.user?._id,
        socketId: userEntry._id,
        userName: userEntry.user.userName
    } : null;
};





module.exports = {
    encrypt,
    comparePass,
    uploadFile,
    getUserPrimaryKey
}