const config = {
  name: "reptag",
  description: "",
  usage: "[content]/[off]",
  cooldown: 3,
  permissions: [2],
  credits: "vml",
};

if (!global.autoreply_173) {
  global.autoreply_173 = new Map();
}

async function onCall({ message, args }) {
  let userMentioned = Object.values(message.mentions);
  let content = args.join(" ");
  for (let user of userMentioned) {
    content = content.replace(user, "");
  }
  if (content.length == 0)
    return await message.reply("Please enter a message to reply with.");

  if (content === "off") {
    global.autoreply_173.delete(message.threadID);
    return await message.reply("Ｓｈｕｔｄｏｗｎ．．．！！");
  }

  let option = {
    content,
    ids_reply: []
  }

  if (Object.keys(message.mentions) > 0) {
    option.ids_reply = Object.keys(message.mentions)
  }

  global.autoreply_173.set(message.threadID, option);

  await message.reply("Đã bật");
}

export default {
  config,
  onCall,
};