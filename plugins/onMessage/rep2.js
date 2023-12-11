import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path"

const path = join(global.assetsPath, 'atr.json');

function onLoad() {
  if (!existsSync(path)) {
    writeFileSync(path, JSON.stringify({}));
  }
  if (!global.atr_888_cd) global.atr_888_cd = new Map();
}

function onCall({ message }) {
  const { threadID, senderID } = message;
  if (senderID == global.botID) return;
  let data = JSON.parse(readFileSync(path, "utf-8"));
  if (!data[threadID] || !data[threadID].enable) return;
  const COOLDOWN = 1000 * 5;
  const cooldown = global.atr_888_cd.get(message.threadID) || 0;

  if (Date.now() - cooldown < COOLDOWN || message.args[1] == "off") return;

  global.atr_888_cd.set(message.threadID, Date.now());
  message.send({
    body: data[threadID].input
  })
}

export {
  onLoad,
  onCall
}