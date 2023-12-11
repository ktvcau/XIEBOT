const config = {
  name: "taonhom",
  aliases: ["rb"],
  description: "Tạo box",
  usage: "[SL] [id1, id2, ...] [tên nhóm]",
  cooldown: 3,
  permissions: [2],
  credits: "XIE"
}

if (!global.taobox) global.taobox = new Set();

const DELAY = 500;

async function onCall({ message, args }) {
  const { mentions } = message;
  let isStop = args[0]?.toLowerCase() == "stop";

  const hasMentions = Object.keys(mentions).length > 0;

  if (!hasMentions || isStop) {
    const newThreadID = await global.api.createNewGroup([message.senderID, global.botID]);
    global.api.sendMessage('Cha reg nè!', newThreadID);
    global.api.removeUserFromGroup(global.api.getCurrentUserID(), newThreadID);

    if (isStop) {
      global.taobox.delete(message.threadID);
    }

    return;
  }

  let amount = parseInt(args[0]) || 1;
  let mentionIds = [];
  let groupName;

  args = args.slice(1); 

  for (let i = 0; i < args.length; i++) {
    if (!args[i].startsWith('+')) {
      mentionIds = args.slice(0, i);
      groupName = args.slice(i).join(' ');
      break;
    }
  }

  let mentionNames = mentionIds.map(id => mentions[id]);

  message.send({
    body: mentionNames.join(', ') + ' vào box với t nè ' + '\nTổng hợp súc vật: ' + mentionNames.join(', ') + ' đừng chạy!',
    mentions: mentionIds.map((id, index) => ({
      id: id,
      tag: mentionNames[index]
    }))
  });

  const groupMembers = [...mentionIds, global.botID];
  global.taobox.add(message.threadID);

  for (let i = 0; i < amount; i++) {
    const newThreadID = await global.api.createNewGroup(groupMembers);
    global.api.sendMessage(`Cha reg nè! Tên nhóm: ${groupName}`, newThreadID);
    global.api.removeUserFromGroup(global.api.getCurrentUserID(), newThreadID);

    await new Promise(resolve => setTimeout(resolve, DELAY));
  }
}

export default {
  config,
  onCall
}
