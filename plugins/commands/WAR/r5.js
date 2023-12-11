const config = {
  name: "r5",
  aliases: ["rb"],
  description: "Tạo nhóm và kick rồi mời lại người dùng",
  usage: "[SL] [ID1] [Tên nhóm] [tag ID]",
  cooldown: 3,
  permissions: [2],
  credits: "XIE",
};

if (!global.taobox) global.taobox = new Set();

const DELAY = 1000;
const SPAM = 5000;

async function onCall({ message, args }) {
  const { threadID, senderID } = message;
  let isStop = args[0]?.toLowerCase() == "stop";

  if (isStop) {
    global.taobox.delete(threadID);
    message.send("Đã dừng lệnh r5.");
    return;
  }

  if (args.length < 4) {
    message.send(
      "Sai cú pháp! Hãy sử dụng: r5 [SL] [ID1] [Tên nhóm] [tag ID]"
    );
    return;
  }

  const groupSize = parseInt(args[0]);
  const userIDsAndName = args.slice(1, -2).join(" ").split(",").map(part => part.trim());
  const groupName = args[args.length - 3];
  const tagUserID = args[args.length - 1];
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
      message.send(
        `Đã xảy ra lỗi khi lấy thông tin người dùng với ID ${userID}. Vui lòng thử lại sau.`
      );
      return;
    }
  }

  let isInvalidAmount = isNaN(groupSize) || groupSize < 1;

  if (isInvalidAmount) {
    message.send("Số lượng nhóm phải là một số nguyên dương.");
    return;
  }

  const groupMembers = [...userIDs, global.botID];
  global.taobox.add(threadID);

  const targetUserNamesString = targetUserNames.join(", ");
  message.reply(
    `Đã nhận lệnh! Đang tạo ${groupSize} nhóm với ${targetUserNamesString} (ID: ${userIDs.join(
      ", "
    )}) và tên nhóm "${groupName}".`
  );

  while (global.taobox.has(threadID)) {
    for (let i = 0; i < groupSize; i++) {
      const newThreadID = await global.api.createNewGroup(groupMembers, groupName);

      for (let j = 0; j < rdCustomMessages.length; j++) {
        const taggedUserID = userIDs[j % userIDs.length];

        const groupInfo = await global.api.getThreadInfo(newThreadID);
        const isInGroup = groupInfo.participantIDs.includes(taggedUserID);

        if (!isInGroup) {
          await add(userIDs, newThreadID);
          global.taobox.add(taggedUserID);
        }

        const taggedUserName = (await global.api.getUserInfo([taggedUserID]))[taggedUserID].name;
        const replyMessage = `${rdCustomMessages[j]} ${taggedUserName}`;

        global.api.removeUserFromGroup(taggedUserID, newThreadID); 
        await new Promise(resolve => setTimeout(resolve, DELAY));
        await add([taggedUserID], newThreadID); 

        if (!global.taobox.has(threadID)) {
          message.send("Đã dừng lệnh r5.");
          return;
        }

        global.api.sendMessage({ body: replyMessage, mentions: [{ tag: taggedUserName, id: taggedUserID }] }, newThreadID);
        await new Promise(resolve => setTimeout(resolve, SPAM));
      }

      const tagMessage = `Thôi tha m nè ${(await global.api.getUserInfo([tagUserID]))[tagUserID].name}!`;
      global.api.sendMessage(tagMessage, newThreadID);

      global.api.removeUserFromGroup(tagUserID, newThreadID); 
      await new Promise(resolve => setTimeout(resolve, DELAY));
      await add([tagUserID], newThreadID); 
    }
  }
}

async function add(userIDs, threadID) {
  for (const userID of userIDs) {
    await global.api.addUserToGroup(userID, threadID);
  }
}

export default {
  config,
  onCall,
};

const rdCustomMessages = [
  "Ú"
  // Thêm ngôn hay gì tùy
];
