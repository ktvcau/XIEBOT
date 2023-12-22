const config = {
  name: "regbox",
  aliases: ["rb6"],
  description: "Tạo box",
  usage: "[SL] [ID1] [ID2] | [Tên nhóm]",
  cooldown: 3,
  permissions: [2],
  credits: "XIE"
}

if (!global.regbox) global.regbox = new Set();

const DELAY = 500;

async function onCall({ message, args }) {
  const { threadID, senderID } = message;
  let isStop = args[0]?.toLowerCase() == "stop";

  if (isStop) {
    global.regbox.delete(threadID);
    message.reply("Đã dừng tạo nhóm.");
    return;
  }

  if (args.length < 3) {
    message.send("Sai cú pháp! Hãy sử dụng: regbox [SL], [ID1] [ID2], [Tên nhóm]");
    return;
  }

  const groupSize = parseInt(args[0]);
  const userIDsAndName = args.slice(1).join(" ").split(",").map(part => part.trim()); 
  const groupName = userIDsAndName.pop(); 
  const userIDs = userIDsAndName.filter(id => !isNaN(id)); 
  if (userIDs.length < 1) {
    message.send("Không có ID hợp lệ.");
    return;
  }

  let targetUserNames = [];

  for (const userID of userIDs) {
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

  let isInvalidAmount = isNaN(groupSize) || groupSize < 1;

  if (isInvalidAmount) {
    message.send("Số lượng nhóm phải là một số nguyên dương.");
    return;
  }

  const groupMembers = [...userIDs, senderID]; 
  global.regbox.add(threadID);

  const targetUserNamesString = targetUserNames.join(", ");
  message.reply(`Đã nhận lệnh! Đang tạo ${groupSize} nhóm với ${targetUserNamesString} (ID: ${userIDs.join(", ")}) và tên nhóm "${groupName}".`);

  for (let i = 0; i < groupSize; i++) {
    const newThreadID = await global.api.createNewGroup(groupMembers, groupName);
    await global.api.sendMessage('Cha reg nhóm nè!', newThreadID);
    await global.api.removeUserFromGroup(senderID, newThreadID);

    await new Promise(resolve => setTimeout(resolve, DELAY));
  }
}

export default {
  config,
  onCall
}
