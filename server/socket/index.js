const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const { getUserDetailFormToken } = require("../Helper/getUserDetailFromToken.js");
const UserModel = require("../Models/UserModel.js");
const { getConversation } = require("../Helper/getConversation.js");
const { MessageUrl, ConversationModel } = require("../Models/ConversationModel.js");
const app = express();

// socket connection 
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true,
    }
})

// Online User
const onlineUser = new Set();

io.on("connection", async (socket) => {

    const token = socket.handshake.auth.token;

    //Details of current user
    const user = await getUserDetailFormToken(token)

    // create a conversation room for clients
    socket.join(user?._id?.toString());
    onlineUser.add(user?._id?.toString());

    io.emit("Online User", Array.from(onlineUser))
    socket.on("message-page", async (userId) => {
        const userDetail = await UserModel.findById(userId).select("-password");

        const payload = {
            _id: userDetail?._id,
            name: userDetail?.name,
            email: userDetail?.email,
            profile_pic: userDetail?.profile_pic,
            online: onlineUser.has(userId),
        };

        socket.emit("message-connect", payload);

        // Fetch previous messages when login
        const getConversationMessages = await ConversationModel.findOne({
            "$or": [
                { sender: user?._id, reciever: userId },
                { sender: userId, reciever: user?._id },
            ],
        }).populate("messages").sort({ updatedAt: -1 });

        // Ensure getConversationMessages is not null
        if (getConversationMessages) {
            socket.emit("message", getConversationMessages?.messages);
        } else {
            // Send an empty array if no messages exist
            socket.emit("message", []);
        }
    });

    //new message 
    socket.on("new message", async (data) => {

        let conversation = await ConversationModel.findOne({
            "$or": [
                { sender: data?.sender, reciever: data?.reciever },
                { sender: data?.reciever, reciever: data?.sender },
            ]
        });

        if (!conversation) {
            const createConversation = await ConversationModel({
                sender: data?.sender,
                reciever: data?.reciever
            })

            conversation = await createConversation.save();
        }

        const message = new MessageUrl({
            text: data?.text,
            imageUrl: data?.imageUrl,
            videoUrl: data?.videoUrl,
            msgByUserId: data?.msgByUserId
        });

        const saveMessage = await message.save();

        const updateConversation = await ConversationModel.updateOne({ _id: conversation?.id }, {
            "$push": {
                messages: saveMessage?._id
            }
        })

        const getConversationMessages = await ConversationModel.findOne({
            "$or": [
                { sender: data?.sender, reciever: data?.reciever },
                { sender: data?.reciever, reciever: data?.sender },
            ]
        }).populate("messages").sort({ updatedAt: -1 })

        io.to(data?.sender).emit("message", getConversationMessages?.messages || []);
        io.to(data?.reciever).emit("message", getConversationMessages?.messages || []);

        //sidebar conversation 
        const conversationSender = await getConversation(data?.sender);
        const conversationReciever = await getConversation(data?.reciever);

        io.to(data?.sender).emit("conversation", conversationSender);
        io.to(data?.reciever).emit("conversation", conversationReciever);
    })

    //Sidebar connection
    socket.on("sidebar", async (currentUserId) => {
        try {
            const conversation = await getConversation(currentUserId);

            socket.emit("conversation", conversation);
        } catch (error) {
            console.log("Sidebar Error : ", error);

        }
    })

    //Seen verify => live conversation 
    socket.on("seen", async (messageByUserId) => {
        try {
            let conversation = await ConversationModel.findOne({
                "$or": [
                    { sender: user?._id, reciever: messageByUserId },
                    { sender: messageByUserId, reciever: user?._id },
                ]
            });

            const conversationMessageId = conversation?.messages || [];

            const updatedMessages = await MessageUrl.updateMany(
                {
                    _id: { "$in": conversationMessageId },
                    msgByUserId: messageByUserId
                },
                {
                    "$set": { seen: true }
                }
            );

            //conversation
            const conversationSender = await getConversation(user?._id);
            const conversationReciever = await getConversation(messageByUserId);
    
            io.to(user?._id?.toString()).emit("conversation", conversationSender);
            io.to(messageByUserId).emit("conversation", conversationReciever);

        } catch (error) {
            console.log("seen verify connection : ", error);
        }
    })

    //Disconnect here
    socket.on("disconnect", (socket) => {
        onlineUser.delete(user?._id);
        console.log("Disconnected", socket.id);

    })
})

module.exports = {
    app,
    server
}
