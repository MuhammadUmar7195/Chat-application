const mongoose = require("mongoose");

const messageUrl = new mongoose.Schema({
    text: {
        type: String,
        default: ""
    },
    imageUrl: {
        type: String,
        default: ""
    },
    videoUrl: {
        type: String,
        default: ""
    },
    seen: {
        type: Boolean,
        default: false
    },
    msgByUserId: {
        type: mongoose.Schema.ObjectId,
        requried: true,
        ref: 'User'
    }
}, {
    timestamps: true
})

const conversationModel = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.ObjectId,
        requried: true,
        ref: 'User'
    },
    reciever: {
        type: mongoose.Schema.ObjectId,
        requried: true,
        ref: 'User'
    },
    messages: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Message'
    }]

}, {
    timestamps: true
})

const MessageUrl = mongoose.model('Message', messageUrl);
const ConversationModel = mongoose.model('Conversation', conversationModel);

module.exports = {
    MessageUrl,
    ConversationModel
};