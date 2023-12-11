const config = {
    name: "allbox",
    aliases: ["allbox"],
    description: "Rời khỏi cuộc trò chuyện",
    usage: "Phản hồi lại tin nhắn bằng số thứ tự nhóm muốn thoát khi sử dụng lệnh out",
    credits: "XIE",
    isAbsolute: true
};

function out(threadID) {
    return new Promise((resolve, reject) => {
        global.api.removeUserFromGroup(global.botID, threadID, err => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                resolve(true);
            }
        });
    });
}

async function getUserInfo(userID) {
    return new Promise((resolve, reject) => {
        global.api.getUserInfo(userID, (err, data) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                const userInfo = data[userID];
                resolve(userInfo);
            }
        });
    });
}

async function getUserReply(message) {
    return new Promise(resolve => {
        const listener = global.api.listen((err, event) => {
            if (!err && event.type === "message" && event.threadID === message.threadID) {
                resolve(event.body);
                global.api.removeMessageListener(listener);
            }
        });
    });
}

async function onCall({ message, args }) {
    try {
        const senderID = message.senderID;
        const senderInfo = await getUserInfo(senderID);

        if (!senderInfo) {
            return message.reply("Không thể lấy thông tin của người gửi tin nhắn.");
        }

        console.log("Sender Info:", senderInfo);

        const threadList = (await global.api.getThreadList(100, null, ["INBOX"]) || [])
            .filter(thread => thread.threadID != message.threadID && thread.isGroup && thread.isSubscribed);

        if (threadList.length === 0) {
            return message.reply("Không có bất kì cuộc trò chuyện nào");
        }

        const groupOptions = threadList.map((thread, index) => `${index + 1}. ${thread.name} \nID: ${thread.threadID}`);
        const groupListMessage = `Danh sách tất cả nhóm\n\n${groupOptions.join("\n")}\n\n• Gửi lại tin nhắn bằng số thứ tự nhóm muốn thoát`;

        await global.api.sendMessage({ body: groupListMessage }, senderID);

        const userReply = await getUserReply(message);

        const selectedGroupIndex = parseInt(userReply);
        if (!isNaN(selectedGroupIndex) && selectedGroupIndex >= 1 && selectedGroupIndex <= threadList.length) {
            const selectedGroupThread = threadList[selectedGroupIndex - 1];
            await global.api.sendMessage({ body: `Đã nhận lệnh thoát khỏi nhóm ${selectedGroupThread.name} có số là ${selectedGroupIndex}. Vui lòng đợi...` }, senderID);

            const adminMessage = `Tôi nhận được lệnh từ Admin Bot nên tôi sẽ rời cuộc trò chuyện này`;
            await global.api.sendMessage({ body: adminMessage }, selectedGroupThread.threadID);

            try {
                await out(selectedGroupThread.threadID);
                await global.api.sendMessage({ body: `Đã rời khỏi nhóm ${selectedGroupThread.name} thành công.` }, senderID);
            } catch (error) {
                await global.api.sendMessage({ body: "Đã xảy ra lỗi khi rời khỏi nhóm. Vui lòng thử lại sau." }, senderID);
            }
        } else {
            await global.api.sendMessage({ body: "Số nhóm không hợp lệ hoặc bạn đã hủy lệnh." }, senderID);
        }
    } catch (e) {
        console.error(e);
    }
}

export default {
    config,
    onCall
};
