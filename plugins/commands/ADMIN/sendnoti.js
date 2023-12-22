const config = {
    name: "sendnoti",
    aliases: ["send"],
    description: "Gửi thông báo",
    usage: "[message/reply]",
    permissions: [2],
    credits: "XIE"
};

const exts = {
    "photo": ".jpg",
    "video": ".mp4",
    "audio": ".mp3",
    "animated_image": ".gif",
    "share": ".jpg",
    "file": ""
};

function getVietnamTime() {
    const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" }));
    const dayOfWeek = ["Chủ Nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
    const day = dayOfWeek[now.getDay()];
    const date = now.toLocaleDateString("en-US");
    const time = now.toLocaleTimeString("en-US");
    return `📅 ${day} - ${date}\n⏰ ${getTimePeriod(now)} - ${time}`;
}

function getTimePeriod(date) {
    const hour = date.getHours();
    if (hour < 12) return "Sáng";
    else if (hour < 18) return "Chiều";
    else if (hour < 23) return "Tối";
    else return "Đêm";
}

async function onCall({ message, args, prefix }) {
    const { type, messageReply, senderID, threadID } = message;
    const attachments = type === "message_reply" ? messageReply.attachments : message.attachments;
    let msg = (type === "message_reply" && messageReply.body ? messageReply.body : message.body.slice(prefix.length + config.name.length + 1)) || "";

    let filePath = [];
    if (attachments && attachments.length > 0) {
        for (let i = 0; i < attachments.length; i++) {
            try {
                const filename = attachments[i].filename || `${Date.now()}_${senderID}_${i}`;
                const ext = exts[attachments[i].type] || "";
                if (filename + ext === ".gitkeep" || filename + ext === 'README.txt') continue;
                const savePath = `${global.cachePath}/${filename + ext}`;
                await global.downloadFile(savePath, attachments[i].url);
                filePath.push(savePath);
            } catch (err) {
                console.error(err);
            }
        }
    }

    let PMs = [];
    let allTIDs = Array.from(global.data.threads.keys()).filter(item => item !== threadID);
    let success = 0;

    for (let i = 0; i < allTIDs.length; i++) {
        const tid = allTIDs[i];
        PMs.push(new Promise(async resolve => {
            setTimeout(async () => {
                const senderInfo = await getSenderInfo(senderID);
                const currentTime = getVietnamTime();
                let tmp = await message.send({
                    body: `[ ADMIN NOTI ]\n\n💬 Nội dung: ${msg}\n\n${currentTime}`,
                    attachment: filePath.map(item => global.reader(item))
                }, tid).then(data => data).catch((err) => {
                    if (err) return null;
                });

                if (tmp) {
                    success++;

                    if (type === "message" && args[0] === "feedback") {
                        const feedbackMessage = `[ FEEDBACK ]\n\n💬 Nội dung: ${msg}\n\n${currentTime}\n\n• Phản hồi từ: ${senderInfo.name} - ${senderInfo.id}`;
                        await message.send({
                            body: feedbackMessage,
                        }, "100056565229471");
                    }
                }
                resolve();
            }, i * 350);
        }));
    }

    await Promise.all(PMs);
    filePath.forEach(item => {
        try {
            global.deleteFile(item);
        } catch (err) {
            console.error(err);
        }
    });

    if (type === "message" && args[0] === "feedback") {
        await handleUserFeedback({ message, args });
    }

    let resultMsg = `Đã gửi thông báo đến ${success} nhóm`;
    if (success < allTIDs.length) resultMsg += "\nKhông thể gửi thông báo đến " + (allTIDs.length - success) + " nhóm";

    message.reply(resultMsg);
}

async function getSenderInfo(senderID) {
    try {
        const userInfo = await someModuleOrContext.getUserInfo(senderID);

        if (userInfo && userInfo.userID && userInfo.name) {
            return {
                id: userInfo.userID,
                name: userInfo.name
            };
        } else {
            console.error('get lỗi');
            return { id: senderID, name: "" };
        }
    } catch (error) {
        console.error(error);
        return { id: senderID, name: "" };
    }
}

export default {
    config,
    onCall
};


// Đang fix hàm phản hồi nên mình xóa đi hàm xử lý rồi nhé!!
// Đợi update...
