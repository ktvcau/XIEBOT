
import { existsSync, readFileSync, writeFileSync, createReadStream } from "node:fs";
import { join } from "node:path"

const path = join(global.assetsPath, 'rep4.json');

function onLoad() {
  if (!existsSync(path)) {
    writeFileSync(path, JSON.stringify({}));
  }
  if (!global.rep4_888_cd) global.rep4_888_cd = new Map();
}

function onCall({ message }) {
  const { threadID, senderID } = message;
  if (senderID == global.botID) return;
  let data = JSON.parse(readFileSync(path, "utf-8"));
  if (!data[threadID] || !data[threadID].enable) return;
  const COOLDOWN = 1000 * 1;
  const cooldown = global.rep4_888_cd.get(message.threadID) || 0;

  if (Date.now() - cooldown < COOLDOWN || message.args[1] == "off") return;

  global.rep4_888_cd.set(message.threadID, Date.now());
  if (
    (data[threadID].mention != "" && data[threadID].mention == senderID) ||
    data[threadID].mention == ""
  ) {
    message.send({
      body: data[threadID].content,
      attachment: createReadStream(data[threadID].path)
    })
  }
}

export {
  onCall,
  onLoad
}