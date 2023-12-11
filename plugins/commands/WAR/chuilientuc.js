// chửi vĩnh viễn
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const config = {
  name: "chuilientuc3",
  aliases: ["thichvar"],
  description: "",
  usage: "",
  cooldown: 3,
  permissions: [2],
};
let reotag = [
  "sủa lẹ đi",
  "úi cn bướm khắm:))))",
  "cn già mày đập đt mày à eyy:))) ",
  "úi coi cn bẻm nó bị chà đạp kìa:)))",
  "khắm chui dô bướm con đĩ già nó chặn keo núp trỏng à:))))",
  "câm à con ngu:)))",
  " eyyy:))",
  "úi cái con hôi:)))",
  "chết cn già mày à:)))",
  "địt con cụ mày phọt khí bướm:)))",
  "úi cha bị úp:))) con trốn đâu r ae:)))",
  "ơi sao m ngu vậy",
  "M là con chó dưới chân t phải k?",
  "êi culi",
  "nào mày mới bằng được cái móng chân tao á",
  "con mẹ mày ngu à",
  "con chó m sủa lẹ t coi",
  "m ngu mà phải không",
  "bede sủa lẹ đi",
  "thằng đầu đinh đâu rồi",
  "sồn lên với tao đi nè thằng boài",
  "thằng như mày xứng đáng ăn cứt tao á",
  "cố gắng mà để win tao nhe",
  "tao bất bại mà thằng ngu",
  "ẳng hăng vào đi chứ mày ẳng gì mà nhạt nhẽo thế",
  "mạnh mẽ lên xem nào",
  "kém cỏi thế thằng mồ côi",
  "phản kháng êi sao đứng yên chịu trận vậy",
  "bất hiếu à",
  "thằng đú m sủa đi nào",
  "mẹ mày bị tao đầu độc tới chết mà",
  "tao trùm mẹ rồi còn gì mà cãi nữa",
  "kiki sủa đi nè",
  "đàn ông hay đàn bà mà yếu đuối vậy",
  "mau đi nè em êi",
  "chậm chạp vậy",
  "thằng bất tài vô dụng sủa mạnh lên đi",
  "bà già mày bị tao treo cổ lên trên trần nhà mà",
  "mày còn gì mới nữa không đó em",
  "thằng đầu đinh cay cú tao à :)))",
  "tao bá đạo vcl 🤣",
  "êi thằng nghèo sao câm rồi",
  "mày xứng đáng ăn cứt tao :))",
  "thằng vô sinh cay cú tao à",
  "mày cố gắng để được như tao đi",
  "bắt chước tao à thằng ngu",
  "quỳ lạy van xin tao đi nè",
  "con hai néo như mày đang diễn hài cho tao cười đấy à",
  "bị tao chửi tới hóa dại luôn rồi à",
  "vô sinh mà đòi đẻ con à thằng boài",
  "con cặc chưa mở mắt mà đòi đụ ai",
  "mày sợ tao rồi hả",
  "khắc tinh đời mày là tao nè",
  "sủa hăng vào cho tao có hứng êi",
  "thằng chó đẻ dân tộc miên hay sao mà đen thế",
  "cố lên đi nè em êi",
  "sắp win được rồi á",
  "có cửa để win tao không",
  "mày đang nằm mơ hay sao á",
  "tao bất bại cmnr",
  "tao là bá chủ thiên hạ đấy",
  "tới sáng không",
  "mày sửa nữa đi sao mà im re rồi",
  "tao cho mày câm chưa mà mày câm thế",
  "đấu tranh đê thằng nhu nhược",
  "hăng hái lên đê em êi",
  "đàn ông mà sức lức như đàn bả vậy",
  "cay cú ôm hận tao suốt đời nè phải không",
  "úi cái con chó này bị ngu à"
]

setInterval(() => {
  let data = JSON.parse(readFileSync(join(global.assetsPath, "reotag.json"), "utf-8"));
  for (let [key, value] of Object.entries(data)) {
    if (value.enable) {
      if (value.index >= reotag.length) value.index = 0;
      api.sendMessage({
        body: `${reotag[value.index]} ${value.name}`,
        mentions: [{
          tag: value.name,
          id: value.id
        }]
      }, key, () => {
        value.index++;
        writeFileSync(join(global.assetsPath, "reotag.json"), JSON.stringify(data, null, 4), "utf-8");
      })
    }
  }
}, 6000)

const path = join(global.assetsPath, 'reotag.json');
function onLoad() {
  if (!existsSync(path)) {
    writeFileSync(path, JSON.stringify({}), "utf-8");
  }
}

async function onCall({ message, args }) {
  const { threadID } = message;

  let data = JSON.parse(readFileSync(path, "utf-8"));
  if (!data[threadID]) data[threadID] = {
    enable: true,
    index: 0,
    id: "",
    name: ""
  };

  let input = args.join(" ");
  if (input == "off") {
    data[threadID].enable = false;
    data[threadID].index = 0;
    data[threadID].id = "";
    data[threadID].name = "";
  } else {
    if (Object.keys(message.mentions).length != 0) {
      data[threadID].enable = true;
      data[threadID].id = Object.keys(message.mentions)[0];
      data[threadID].name = Object.values(message.mentions)[0]
    } else return message.send("Thiếu tag");
  }

  writeFileSync(path, JSON.stringify(data, null, 4), "utf-8");

  message.send(`Đã ${(input == "off" ? "tắt" : "bật")}`);
}

export {
  config,
  onCall,
  onLoad
}