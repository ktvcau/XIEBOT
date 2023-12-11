import { existsSync, readFileSync, writeFileSync, createReadStream } from "node:fs";
import { join } from "node:path"

const path = join(global.assetsPath, 'rin.json');

function onLoad() {
  if (!existsSync(path)) {
    writeFileSync(path, JSON.stringify({}));
  }
  if (!global.rin_888_cd) global.rin_888_cd = new Map();
}

let rin = [
  "sủa lẹ đi {name}",
  "úi cn {name} bướm khắm:))))",
  "cn già mày đập đt mày à {name} eyy:))) ",
  "úi coi cn bẻm {name} nó bị chà đạp kìa:)))",
  "{name} khắm chui dô bướm con đĩ già nó chặn keo núp trỏng à:))))",
  "câm à con {name} ngu:)))",
  "{name} eyyy:))",
  "úi cái con {name} hôi:)))",
  "chết cn già mày à {name}:)))",
  "địt con {name} cụ mày phọt khí bướm:)))",
  "úi {name} cha bị úp:))) {name} con trốn đâu r ae:)))",
  "{name} ơi sao m ngu vậy {name}",
  "{name} M là con chó dưới chân t phải k? {name}",
  "êi culi {name}",
  "nào mày mới bằng được cái móng chân tao á {name}",
  "con mẹ mày ngu à {name}",
  "con chó {name} m sủa lẹ t coi",
  "m ngu mà phải không {name}",
  "{name} bede sủa lẹ đi",
  "thằng {name} đầu đinh đâu rồi",
  "sồn lên với tao đi nè thằng boài {name}",
  "thằng như mày xứng đáng ăn cứt tao á {name}",
  "cố gắng mà để win tao nhe {name}",
  "tao bất bại mà thằng ngu {name}",
  "ẳng hăng vào đi chứ mày ẳng gì mà nhạt nhẽo thế {name}",
  "mạnh mẽ lên xem nào {name}",
  "kém cỏi thế thằng mồ côi {name}",
  "phản kháng êi sao đứng yên chịu trận vậy {name}",
  "bất hiếu à {name}",
  "thằng đú {name} m sủa đi nào",
  "mẹ mày bị tao đầu độc tới chết mà {name}",
  "tao trùm mẹ rồi còn gì mà cãi nữa {name}",
  "kiki sủa đi nè {name}",
  "đàn ông hay đàn bà mà yếu đuối vậy {name}",
  "mau đi nè em êi {name}",
  "chậm chạp vậy {name}",
  "thằng bất tài vô dụng sủa mạnh lên đi {name}",
  "bà già mày bị tao treo cổ lên trên trần nhà mà {name}",
  "mày còn gì mới nữa không đó em {name}",
  "thằng đầu đinh cay cú tao à :))) {name}",
  "tao bá đạo vcl 🤣 {name}",
  "êi thằng nghèo sao câm rồi {name}",
  "mày xứng đáng ăn cứt tao :)) {name}",
  "thằng vô sinh cay cú tao à {name}",
  "mày cố gắng để được như tao đi {name}",
  "bắt chước tao à thằng ngu {name}",
  "quỳ lạy van xin tao đi nè {name}",
  "con hai néo như mày đang diễn hài cho tao cười đấy à {name}",
  "bị tao chửi tới hóa dại luôn rồi à {name}",
  "vô sinh mà đòi đẻ con à thằng boài {name}",
  "con cặc chưa mở mắt mà đòi đụ ai {name}",
  "mày sợ tao rồi hả {name}",
  "khắc tinh đời mày là tao nè {name}",
  "sủa hăng vào cho tao có hứng êi {name}",
  "thằng chó đẻ dân tộc miên hay sao mà đen thế {name}",
  "cố lên đi nè em êi {name}",
  "sắp win được rồi á {name}",
  "có cửa để win tao không {name}",
  "mày đang nằm mơ hay sao á {name}",
  "tao bất bại cmnr {name}",
  "tao là bá chủ thiên hạ đấy {name}",
  "tới sáng không {name}",
  "mày sửa nữa đi sao mà im re rồi {name}",
  "tao cho mày câm chưa mà mày câm thế {name}",
  "đấu tranh đê thằng nhu nhược {name}",
  "hăng hái lên đê em êi {name}",
  "đàn ông mà sức lức như đàn bả vậy {name}",
  "cay cú ôm hận tao suốt đời nè phải không {name}",
  "úi cái con chó {name} này bị ngu à"
]

function onCall({ message }) {
  const { threadID, senderID } = message;
  if (senderID == global.botID) return;
  let data = JSON.parse(readFileSync(path, "utf-8"));
  if (!data[threadID] || !data[threadID].enable) return;
  const COOLDOWN = 1000 * 3;
  const cooldown = global.rep4_888_cd.get(message.threadID) || 0;

  if (Date.now() - cooldown < COOLDOWN || message.args[1] == "off") return;

  global.rin_888_cd.set(message.threadID, Date.now());
  if (
    (data[threadID].mention != "" && data[threadID].mention == senderID) ||
    data[threadID].mention == ""
  ) {
    if (data[threadID].index >= rin.length) data[threadID].index = 0;
    message.send({
      body: rin[data[threadID].index].replace(/{name}/g, data[threadID].content),
      attachment: createReadStream(data[threadID].path)
    })
    data[threadID].index++;
    writeFileSync(path, JSON.stringify(data, null, 4));
  }
}

export {
  onCall,
  onLoad
}