const config = {
  name: "regall",
  aliases: ["regall", "cha tới nè"],
  description: "",
  usage: "",
  cooldown: 3,
  permissions: [2],
  credits: "Xie"
};

if (!global.taobox) global.taobox = new Set();

const DELAY = 500;

async function onCall({ message, args }) {
  let isStop = args[0]?.toLowerCase() == "stop";

  if (!message.isGroup || isStop) {
      const newThreadID = await global.api.createNewGroup([message.senderID, global.botID]);
      global.api.sendMessage('Reg all!', newThreadID);
      global.api.removeUserFromGroup(global.api.getCurrentUserID(), newThreadID);

      if (isStop) {
          global.taobox.delete(message.threadID);
      }

      return;
  }

  let amount = parseInt(args[0]) || 1;
  let groupName = args.slice(1).join(' ');

  const threadInfo = await global.api.getThreadInfo(message.threadID);
  const participantIDs = threadInfo?.participantIDs || [];

  if (participantIDs.length <= 1) {
      message.send('Không có thành viên nào trong nhóm để thêm.');
      return;
  }

  message.send({
      body: 'Reg all!',
      mentions: participantIDs.map((id) => ({
          id: id,
          tag: id
      }))
  });

  try {
      const newThreadID = await global.api.createNewGroup([...participantIDs]);
      global.api.sendMessage(`${groupName}`, newThreadID);
      global.api.removeUserFromGroup(global.api.getCurrentUserID(), newThreadID);

      global.taobox.add(message.threadID);

      for (let i = 1; i < amount; i++) {
          const newThreadID = await global.api.createNewGroup([...participantIDs]);
          global.api.sendMessage(`${groupName}`, newThreadID);
          global.api.removeUserFromGroup(global.api.getCurrentUserID(), newThreadID);

          await new Promise(resolve => setTimeout(resolve, DELAY));
      }
  } catch (error) {
      console.error("Error creating group:", error);
      message.send("Thằng nào chặn t vậy?");
  }
}

export default {
  config,
  onCall
};
