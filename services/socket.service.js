const chat = require("../config/schema/chat");
const user = require("../config/schema/user");
const { ObjectId } = require('mongodb');
const { getUserPrimaryKey } = require("../utils");


const userList = {
    // "32332": { _id: "32332", user: { userName: "lowrance ", _id: "6724a402067c27dea8b9bdb6" } },
    // "88372": { _id: "88372", user: { userName: "roman ", _id: "6724a402067c27dea8b9bdd9" } }
};

function registerUser(socketId, user) {
    // userList[socketId] = { _id: "12121221", user: { userName: "harish", _id: "65f28d1faded5b0012e91b91" } };
    userList[socketId] = { _id: socketId, user: { userName: user?.userName, _id: user?.id } };
    console.log("user is", userList)
    return { users: getUserList(socketId), currentUser: userList[socketId] };
}

function unregisterUser(socketId) {
    console.log("unregistered")
    delete userList[socketId];
    return getUserList();
}

function getUserList(id = null) {
    // return Object.keys(userList).filter(x => x !== id).map(x => userList[x])
    return Object.keys(userList).map(x => userList[x])
}


async function changeChat(id, pId) {

    const user = userList[id]
    const partner = userList[pId]
    console.log("user ,partner", id, pId)

    let chatDetails = await chat.findOne({
        $or: [
            {
                userId: user?.user?._id,
                partnerId: partner?.user?._id
            },
            {
                userId: partner?.user?._id,
                partnerId: user?.user?._id
            },
        ]
    })


    let finalPayload = {
        socketId: partner?._id,
        user: userList?.[partner?._id]?.user,
        chat: chatDetails?.msg
    }
    // console.log("final payload", finalPayload)
    return finalPayload;
}


async function sendPrivateMessage(socket, recipientId, message) {

    try {

        const senderId = socket.id
        const sender = userList[senderId];
        const recipiant = userList[recipientId];

        //save msg
        let setMsg = {
            msgType: message?.toString()?.includes("/uploads/") ? "filePath" : "text",
            filePath: message?.toString()?.includes("/uploads/") && message,
            text: message?.toString()?.includes("/uploads/") ? "File" : message,
            to: recipiant?.user?._id,
            from: sender?.user?._id
        }
        let updatedChat = await chat.updateOne({
            $or: [
                { $and: [{ userId: sender?.user?._id, partnerId: recipiant?.user?._id }] },
                { $and: [{ partnerId: sender?.user?._id, userId: recipiant?.user?._id }] },

            ]
        }, {
            $set: { userId: sender?.user?._id, partnerId: recipiant?.user?._id },
            $push: { msg: setMsg }
        }, { upsert: true })

        updatedChat = await chat.findOne({
            $or: [
                { $and: [{ userId: sender?.user?._id, partnerId: recipiant?.user?._id }] },
                { $and: [{ partnerId: sender?.user?._id, userId: recipiant?.user?._id }] },

            ]
        })


        socket.emit('private-message', {
            chat: updatedChat,
        });
        socket.to(recipiant?._id).emit('private-message', {
            chat: updatedChat,
        });



        // update the chat list
        getAllMsgs(socket)





    } catch (error) {
        console.log('error', error)
    }

}

async function getAllMsgs(socket) {

    const userId = socket.id
    const user = userList[userId];

    // let allChats = await chat.find({ userId: user?.user?._id }).lean().sort({updatedAt:-1}).limit(10);
    // allChats = allChats.map(chat=>({...chat,msg:[chat.msg[chat.msg.length-1]]}))

    const allChats = await chat.aggregate([
        {
            $match: {
                $or: [
                    { userId: new ObjectId(user?.user?._id) },
                    { partnerId: new ObjectId(user?.user?._id) }
                ]
            }
        },
        {
            $project: {
                userId: 1,
                partnerId: 1,
                lastMessage: { $arrayElemAt: ['$msg', -1] },
                updatedAt: 1
            }
        },
        {
            $sort: { 'updatedAt': -1 }
        },
        {
            $limit: 10
        }
    ]);


    // let userName =  getUserPrimaryKey(user?.user?._id,userList)

    // let validUserNames = {[userName._id]:userName}
    let validUserNames = {}

    const userNames = allChats.map(async (item) => {

        let partnerName = getUserPrimaryKey(item?.partnerId, userList)
        let userName = getUserPrimaryKey(item?.userId, userList)
        if (partnerName) validUserNames[partnerName?._id] = partnerName
        if (userName) validUserNames[userName?._id] = userName

    });

    console.log("allChats events", allChats)
    console.log("allChats validUserNames", validUserNames)
    socket.emit('all-chats', {
        allChats,
        validUserNames
    });

}


module.exports = {
    registerUser,
    unregisterUser,
    getUserList,
    sendPrivateMessage,
    getAllMsgs,
    changeChat
};
