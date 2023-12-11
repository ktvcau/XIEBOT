import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const config = {
  name: "rin",
  aliases: ["reptdi", "nhucac"],
  description: "",
  usage: "",
  cooldown: 3,
  permissions: [2],
};

const path = join(global.assetsPath, 'rin.json');

function onLoad() {
  if (!existsSync(path)) {
    writeFileSync(path, JSON.stringify({}), "utf-8");
  }
}

async function onCall({ message, args }) {
  const { threadID, messageReply } = message;

  let data = JSON.parse(readFileSync(path, "utf-8"));
  if (!data[threadID]) data[threadID] = {
    enable: true,
    content: "",
    path: "",
    mention: "",
    index: 0
  };

  let content = args.join(" ");
  if (content == "off" && message.type == "message") {
    data[threadID].enable = false;
    data[threadID].content = "";
    data[threadID].path = "";
    data[threadID].mention = "";
  } else if (!messageReply) {
    return message.send("Vui lòng reply ảnh/video.gif")
  } else {
    let obj = {};
    if (messageReply.attachments.length != 0) {
      if (messageReply.attachments[0].type == "photo") {
        obj.path = join(global.assetsPath, `rin_${threadID}.png`);
        obj.url = messageReply.attachments[0].previewUrl;
      } else if (messageReply.attachments[0].type == "animated_image") {
        obj.path = join(global.assetsPath, `rin_${threadID}.gif`);
        obj.url = messageReply.attachments[0].url;
      } else if (messageReply.attachments[0].type == "video") {
        obj.path = join(global.assetsPath, `rin_${threadID}.mp4`);
        obj.url = messageReply.attachments[0].url;
      } else return message.send("Reply không hợp lệ");
      await global.downloadFile(obj.path, obj.url);
    }
    data[threadID].enable = true;
    data[threadID].content = content.replace(`${Object.values(message.mentions)[0]}`, "");
    data[threadID].path = obj.path;
    data[threadID].mention = Object.keys(message.mentions)[0] || "";
    data[threadID].index = 0;
  }

  writeFileSync(path, JSON.stringify(data, null, 4), "utf-8");

  message.send(`Đã ${(content == "off" ? "tắt" : "bật")}`);
}

export {
  config,
  onCall,
  onLoad
}