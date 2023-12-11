const config = {
  name: "taobox",
  aliases: ["rb"],
  description: "Tạo box",
  usage: "[SL] [ID1] [ID2] ...",
  cooldown: 3,
  permissions: [2],
  credits: "XIE"
}

if (!global.taobox) global.taobox = new Set();

const DELAY = 500;

async function onCall({ message, args }) {
  const { senderID } = message;
  let isStop = args[0]?.toLowerCase() == "stop";

  if (args.length < 2) {
    message.send("Sai cú pháp! Hãy sử dụng: taobox [SL] [ID1] [ID2] ...");
    return;
  }

  const userIDs = args.slice(1);
  let targetUserNames = [];

  for (const userID of userIDs) {
    if (isNaN(userID)) {
      message.send(`ID không hợp lệ: ${userID}`);
      return;
    }

    try {
      const userInfo = await global.api.getUserInfo([userID]);
      const userName = userInfo[userID].name;
      targetUserNames.push(userName);
    } catch (error) {
      console.error(`Error retrieving user information for ID ${userID}:`, error);
      message.send(`Đã xảy ra lỗi khi lấy thông tin người dùng với ID ${userID}. Vui lòng thử lại sau.`);
      return;
    }
  }

  let isInvalidAmount = isNaN(args[0]) || parseInt(args[0]) < 1;

  if (isInvalidAmount) {
    message.send("Số lượng nhóm phải là một số nguyên dương.");
    return;
  }

  const groupMembers = [...userIDs, global.botID];
  const groupName = "Lũ gà";
  global.taobox.add(message.threadID);

  const targetUserNamesString = targetUserNames.join(", ");
  message.reply(`Đã nhận lệnh! Đang tạo ${args[0]} nhóm với ${targetUserNamesString} (ID: ${userIDs.join(", ")}).`);

  for (let i = 0; i < parseInt(args[0]); i++) {
    const newThreadID = await global.api.createNewGroup(groupMembers, groupName);
    global.api.sendMessage('Cha reg nhóm nè!', newThreadID);
    global.api.removeUserFromGroup(global.api.getCurrentUserID(), newThreadID);

    await new Promise(resolve => setTimeout(resolve, DELAY));
  }
}

export default {
  config,
  onCall
}
