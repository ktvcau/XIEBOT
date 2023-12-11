const config = {
    name: "setnameall",
    aliases: ["setall"],
    description: "Đổi biệt danh toàn bộ thành viên trong nhóm trừ người gửi lệnh",
    usage: "setall",
    cooldown: 1,
    permissions: [2],
    credits: "XIE",
    extra: {}
}

const nameset = [
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
];

let isChangingNames = false;

async function changeNames(message, excludeUser, content) {
    for (let i = 0; i < nameset.length; i++) {
        if (!isChangingNames) break;

        const nickname = `${content} ${nameset[i]}`;

        for (const p of message.participantIDs) {
            if (p !== excludeUser) {
                await api.changeNickname(nickname, message.threadID, p);
                await new Promise(resolve => setTimeout(resolve, 2000)); 
            }
        }
    }
}

async function onCall({ message, args }) {
    const { api } = global;
    const senderId = message.senderID;
    const content = args.join(" ");

    if (content.length === 0) {
        message.send("Nhập Tên Để Set Đi Culi");
        return;
    }

    if (args[0]?.toLowerCase() === "cl") {
      for (const p of message.participantIDs) {
        await api.changeNickname(null, message.threadID, p);
        //await new Promise((r) => setTimeout(r, 100));
      }
      return message.reply("cay");
    }

    if (args[0]?.toLowerCase() === "stop") {
        isChangingNames = false;
        return message.reply("Đã dừng đổi biệt danh.");
    }

    if (isChangingNames) {
        return message.reply("Chuẩn bị đê");
    }

    isChangingNames = true;
    await changeNames(message, senderId, content); 
    message.reply("Set Thành Công =))");
    isChangingNames = false;
}

export default {
    config,
    onCall
}
