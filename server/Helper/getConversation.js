const { ConversationModel } = require("../Models/ConversationModel.js");

const getConversation = async (currentUserId) => {
    if (currentUserId) {
        const currentUserConversation = await ConversationModel.find({
            "$or": [
                { sender: currentUserId },
                { reciever: currentUserId },
            ]
        }).populate("messages").populate("sender").populate("reciever").sort({ updatedAt: -1 });

        const conversation = currentUserConversation.map((conver) => {


            const countUnseenMsg = conver.messages.reduce((prev, curr) => {
                const msgId = curr?.msgByUserId.toString();

                if (msgId !== currentUserId) {
                    return prev + (curr.seen ? 0 : 1);
                } else {
                    return prev;
                }

            }, 0);

            return {
                _id: conver?._id,
                sender: conver?.sender,
                reciever: conver?.reciever,
                unseenMsg: countUnseenMsg,
                lastMsg: conver.messages[conver?.messages?.length - 1]
            }
        })

        return conversation
    } else {
        return [];
    }
}

module.exports = {
    getConversation
}