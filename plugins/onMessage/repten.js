
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path"

const path = join(global.assetsPath, 'rep3.json');

function onLoad() {
  if (!existsSync(path)) {
    writeFileSync(path, JSON.stringify({}));
  }
  if (!global.rep3_888_cd) global.rep3_888_cd = new Map();
}

let rep3 = [
" sua de {name} ",
" con {name} lùn cay à ",
"con {name} xì trum 🤣",
" con mập {name} ",
" {name} óc sợ à em 🤣 ",
" {name} ngu sủa liên tục",
" {name} ngu cay",
" con {name} bướm trâu 🤣",
" mẹ con {name} bị tao trap ",
" {name} bónk",
" {name} có mẹ ko em ",
" con {name} chắc ko có mẹ r 🤣 ",
" {name} lồn mồ côi 🤣 ",
" mẹ mày chết r à {name} ",
" con {name} mập  ",
"con {name} cay à em",
"con {name} mồ côi",
"con bónk {name} ",
"nhìn con {name} có vẻ sắp chạy 🤣🙄",
" con lùn lùn {name} ",
"con {name} cay 100% r ae ",
"con {name} xì trum cay",
"con lgbt {name} mồ côi ",
"mồ côi = {name} ",
"sợ à con {name} ",
" {name} dái",
" cay cú à {name} ",
" :))) con {name} ngu ngang con già nó",
" {name} óc bím",
"con boài {name} ",
" {name} bê đê cay ",
" {name} lồn mẹ mày bị tao trap mà ",
" {name} cái lồn ",
" con {name} lag à ",
" nhấn help đê con {name} ",
"con {name} gay à ae ",
"sợ à {name} cặc",
"{name} lgbt cay ",
" {name} cặc",
"{name} boài chết r à:)))",
" con chó {name} sợ tao lắm ",
" {name} lồn cay",
" con già m ăn cứt tao mà {name} 🤣",
" {name} dái",
" úi con {name} bị ae tao thay phiên nhau bash cái đầu 🤣 ",
" {name} óc cay à em",
" {name} lồn ko có mẹ ",
" {name} lồn mẹ rip 💀",
" con {name} lồn thiếu thốn tình thương ",
" {name} bị tao fake mẹ đẻ xong bỏ 🤣🙄",
" {name} lồn cay r ae ",
"con già mày {name} ê",
" mẹ con lồn {name} bị tao oneshot chết r ae 🤣",
" {name} bị ae t đánh ",
" {name} mồ côi ",
" {name} lồn  ",
" {name} bím",
" {name} bónk cay à ",
"úi con bede {name} lùn lùn",
" {name} dái cay 🤣",
" {name} lồn ",
" {name} gay cay ",
"gay à {name}  ",
" {name} boài gay 🤣",
" {name} lồn eo di bi ti 🤣",
" sợ à {name} lồn ",
"con boài {name} cay :))) ",
" con {name} 3 tạ ",
" {name} úi úi",
" {name} lồn bị chửi ",
" {name} lùn cay",
" {name} lùn cay r",
" {name} lùn cay tht r ae 🤣 ",
" con {name} lồn bê đê",
":))) sủa liên tục đee {name} bónk",
" {name} boài minion ",
" :))) con {name} chó ",
"con lồn {name} hay đạp xe đạp ngang nhà tao bị tao chọi đá 🤣",
 " {name} mập ",
" {name} lồn mua thuốc giảm cân uống đi em :))) ",
 " {name} lồn đi lún cả đất ae ạ",
" {name} boài bị cả mxh kì thị 🤣",
 " {name} bướm sợ à ae ",
" con {name} heo quay đâu r ae 🤣",
 " {name} ê ",
" {name} lé  ",
 " {name} lé cay à em",
":))( {name} lé à ",
 " {name} lồn 🤣",
" {name} óc bị ae t log acc thay phiên chửi ",
 " chia ca ra hành con {name} đi ae 💀",
" con {name} bede cay 🤣",
 " {name} bónk  ",
" {name} eo di bi ti ",
 " {name} bónk mồ cô 🤣 ",
"con {name} ngu v ae 🤣"
]

function onCall({ message }) {
  const { threadID, senderID } = message;
  if (senderID == global.botID) return;
  let data = JSON.parse(readFileSync(path, "utf-8"));
  if (!data[threadID] || !data[threadID].enable) return;
  const COOLDOWN = 1000 * 1;
  const cooldown = global.rep3_888_cd.get(message.threadID) || 0;

  if (Date.now() - cooldown < COOLDOWN || message.args[1] == "off") return;

  global.rep3_888_cd.set(message.threadID, Date.now());
  if (
    (data[threadID].mention != "" && data[threadID].mention == senderID && message.isGroup) ||
    !message.isGroup
  ) {
    if (data[threadID].index >= rep3.length) data[threadID].index = 0;
    message.send(rep3[data[threadID].index].replace(/{name}/g, data[threadID].content));
    data[threadID].index++;
    writeFileSync(path, JSON.stringify(data, null, 4), "utf-8");
  }
}

export {
  onCall,
  onLoad
}