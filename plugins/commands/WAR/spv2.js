import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const config = {
    name: "sp2",
    aliases: ["nhulon", "kkk"],
    description: "",
    usage: "",
    cooldown: 3,
    permissions: [2],
};
const content = [
 "ANH LÀ TRÙM CÁI SÀN NÀY MÀ - PHẢN KHÁNG CHA ĐI • 你是这层楼的老板 - #XIE"
  ]

  //dvn


  setInterval(() => {
    let data = JSON.parse(readFileSync(join(global.assetsPath, 'spam.json'), "utf-8"));
    for (let [key, value] of Object.entries(data)) {
      if (value.enable) {
        if (value.index >= content.length) value.index = 0;
        api.sendMessage(content[value.index], key, () => {
          value.index++;
          writeFileSync(join(global.assetsPath, 'spam.json'), JSON.stringify(data, null, 4));
        })
      }
    }
  }, 12000)

const path = join(global.assetsPath, 'spam.json');

function onLoad() {
    if(!existsSync(path)) {
        writeFileSync(path, JSON.stringify({}), "utf-8");
    }
}

async function onCall({ message, args }) {
    if(!message.isGroup) return;

    const { threadID } = message;

    let data = JSON.parse(readFileSync(path, "utf-8"));
    if(!data[threadID]) data[threadID] = {
        enable: true,
        index: 0
    };
    let input = args.join(" ");
    if(input == "off") {
        data[threadID].enable = false;
    } else {
        data[threadID].enable = true;
    }
      data[threadID].index = 0;
    writeFileSync(path, JSON.stringify(data, null, 4), "utf-8");

    message.send(`Đã ${(input == "off" ? "tắt" : "bật")}`);
}

export {
    config,
    onLoad,
    onCall
}