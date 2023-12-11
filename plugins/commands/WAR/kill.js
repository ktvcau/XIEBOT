const config = {
  name: "kill",
  aliases: ["kill"],
  description: "chọc dân ửa",
  usage: "kill [USER_ID_1] [USER_ID_2] ...",
  cooldown: 3,
  permissions: [2],
  credits: "Sleiz",
};

let stopFlag = false;

async function sendMessageToUser(message, text, userID, userName) {
  try {
    if (stopFlag) {
      throw new Error("Đã Dừng Chọc Dân Ửa :))");
    }

    if (!userID) {
      throw new Error("Không có ID người dùng.");
    }

    const mention = `${userName}`;
    
    const fullText = `${mention} ${text}`;

    await message.send(fullText, userID);
    await timeout(2000);
  } catch (error) {
    console.error(`Lỗi khi gửi tin nhắn đến người dùng ${userID}: ${error.message}`);
    throw error;
  }
}

async function onCall({ message, args }) {
  try {
    if (args[0] && args[0].toLowerCase() === "stop") {
      stopFlag = true;
      return message.reply("Hoạt động đã bị dừng.");
    }

    if (!args[0]) {
      return message.reply("Vui lòng cung cấp ít nhất một ID người dùng mục tiêu.");
    }

    const userIDs = args;
    const targetUsersInfo = [];

    for (const userID of userIDs) {
      try {
        const userInfo = await global.api.getUserInfo([userID]);
        const userName = userInfo[userID].name;
        targetUsersInfo.push({ userID, userName });
      } catch (error) {
        console.error(`Lỗi khi lấy thông tin người dùng với ID ${userID}:`, error);
        message.send(
          `Đã xảy ra lỗi khi lấy thông tin người dùng với ID ${userID}. Vui lòng thử lại sau.`
        );
        return;
      }
    }

    stopFlag = false;

    await message.send(
      `Bot bắt đầu gửi tin nhắn:\n${targetUsersInfo
        .map(user => `${user.userName} - ${user.userID}`)
        .join("\n")}`
    );

    const content = [
      "Núp đâu rồi con",
         "con  ngu mà =)))",
        "m dốt mà  nói jz :))))",
        "thg  đú mà :)))",
        "m bị ngu hả ",
        "st tí đi con  :))",
        "m kém v ",
        "con già m bị t đụ mà  :)))",
        "con đĩ  sồn mẹ mày đê",
        "bắt quả tang con  sợ chạy cha nè",
        "sao  câm như con chó v :)))",
        "con mẹ mày nè  ngu mà xạo lồn",
        "sao m ớt cha z  :)))",
        "ê con  chạy kìa ae :))))",
        "con  làm được gì không😤",
        "con  chỉ biết phản kháng🤭=))",
        "tk ngu  phản kháng di😏?",
        "con mẹ m đang cầu xin t tha cho m kìa  😏",
        "thg ngu  ăn cứt của anh mà =)))",
        "m đang cầu xin a tha mà dko  :)))",
        "m bị a hành mà  cầu xin a tha đi thg dốt =))))",
        "con  bị a chửi đến mức phải cầu cứu ae mà =))))",
        "thg tật mồ côi  lmj có ba mẹ nè =))))",
        "m có ba mẹ như t k  :))))",
        "m lmj có dko  :)))))",
        "m nhà cùng bà ngoại u70 mà dko  =))))",
        "con  đc bả lấy dú 20cm cho bú :)))",
        "tk lồn  ngậm đắng nuốt cay :))",
        "ngôn m phèn dữ v  :)))))",
        "tao chửi chư mắng mẹ m nằm suy ngẫm mà con 😎",
        "con  bất lực mà :)))",
        "anh nói v m còn phản kháng dc à  :))))",
        "m bất hiếu v  :))))))",
        "m đang làm trò hề ai xem v thg dốt  :))))",
        "t đang xem m lm trò hề nè ",
        "thg ngu  đang cùng đồng bọn của nó làm trò hề cho t xem kìa clm :)))))",
        "mấy con chó sủa lẹ đi ",
        "sủa mẹ mày lên đi ",
        " cay rồi",
        "học ăn học nói học đâu ra cái thứ chảnh lồn v ",
        "tk ngu  mặt cặc mà đòi sủa",
        "tk ngu  làm set đi",
        "tk  não bò",
        "con  là đĩ đú của fb mà 🤣🤣",
        "mày treo rồi à  ",
        "con  cay quá nên treo mẹ rồi",
        "nhất quyết muốn win bọn bố à ",
        "lũ  ăn hại mxh thì lm ra trò j",
        "con gái mẹ  mày die vì tức mày mà ",
        "tk culi  sủa hăng cho bố",
        "làm set đê tk  ngu",
        "con  culi cay òi :((",
        "con chó  cay quá tí đột tử giờ :))",
        "chịu khó học hỏi và thành tâm với anh đi ",
        "mày sợ tao đến die đi sống lại à ",
        "tk culi  dồn anh đi :))",
        "lũ béo  dùng ngôn quốc dân chửi anh à",
        "ở mxh này tag ai làm anh sợ đi    :)))",
        "mày phế nhất mxh mà đk ",
        "cay boài anh rồi à ",
        "sao nhai ngôn liên tục vậy ",
        "tk ngu  cầu cứu rồi à",
        "con bede  cay anh rồi",
        "anh bá hơn m mà ",
        "anh Bá Vãi Mà ",
        "mày học hỏi theo anh à ",
        "tk buồi  cay anh cmnr",
        "dậy mà phản kháng đi ",
        "con  dại dột đụ bà già mày nát bấy mà :)))",
        "con  ngu tứ chi phát triển phản kháng bố đi :))",
        "ăn bố nổi ko tk ngu ",
        "mày sợ bố mà ",
        "lên hăng hái và dồn bố đi ",
        "tk ngu  dùng mấy ngôn bị anh cưỡng chế à",
        "tk ngu boài  chửi bố đi 🤣🤣",
        "con  sợ mẹ nó rồi 👉🤣🤣",
        "tk culi  bị bọn anh chửi à",
        "tk  phế mxh lên lẹ đi",
        "sợ rồi à ",
        "con chó  cay anh",
        "chó  ơi sủa lẹ đi em",
        "mày mồ côi mà xạo à ",
        "yếu kém vậy ",
        "đuối rồi à ",
        "mày đang đi cầu cứu à ",
        "lẹ lẹ đi con nhãi ",
        "mày đg đi cầu cứu rồi hả  ",
        "lũ chó  cầu cứu đi",
        "anh biết nay ngày tàn của mày mò ",
        "con  mồ côi",
        "sao dám so sánh với anh v ",
        "con chó  ngu ngục ơi",
        "sủa đi con  đàn bà",
        "nay gia đình mày bị anh chửi hết mà ",
        "có học thức mà đi ảo mxh à ",
        "cay lắm đk ",
        "nãy h anh chửi cay ko ",
        "con ngu ",
        "con  cayy à ",
        "có cần anh lập lại chửi die mẹ mày k ",
        "con đĩ mẹ mày ",
        "nhanh nhẹn cái tay lên ",
        "sao giờ yếu vậy ",
        "chửi bố đê tk cặc ngu ",
        "mũi tao nghe đc mùi thúi của mày ở dưới đáy xh kìa  :))",
        "ba mẹ mày bị tử hình mà ",
        "bị tử hình nhìn mà thấy tội giúp con   🤣🤣",
        "con gái mẹ mày ",
        "sủa đi con ngu ",
        "anh bá mò ",
        "tk ngu  núp giường nhà anh à",
        "làm osin à ",
        "hihi con chó ngu ",
        "tk boài ",
        "culi mẹ rồi ",
        "dám phản kháng chó đâu ",
        "tật nguyền à  ",
        "dại dột là die con đĩ mẹ mày nè ",
        "culi  ơi sủa đi:3",
        "sợ rồi à ",
        "hehe ",
        "sồn cho bố ",
        "dùng ngôn nhìn phế vậy ",
        "tk tật  vô danh êyy",
        "miếng sát thương được không ",
        "sao ko có j hết vậy ",
        "cay  bố à ",
        "sao chưa j đã cay rồi ",
        "tk ngu   ơi",
        "dựng tóc đứng hết rồi à ",
        "tk culi nhát v ",
        "sồn như bà bầu đi ",
        "sao dạ câm như con chó v ",
        "con mẹ mày nè sao đó ",
        "cay à ",
        "sủa đi chứ tr ",
        "tk mồ côi ",
        "tk béo  cầu cứu mẹ rồi",
        "sợ nên mới cầu cứu à ",
        "má ơi mày sợ anh à ",
        "sợ đến phát khóc rồi à ",
        "con cay cmnr",
        "anh cuti mồ ",
        "đú đởn à ",
        "sợ à bé ",
        "sao vậy ",
        "rồi rồi con",
        "chạy rồi ",
        "hmm sao v con ",
        "tức à ",
        "sồn tí đi ",
        "sao chạy như ",
        "con gái mẹ mày ",
        "nhìn m ngáo chó ghê á  🤣🤣🤣",
        "tk ngu  chửi bố đi",
        "con bồ mày bị tao chịch tét lồn nè ",
        "hăng hái cái mẹ đi   😏",
        "con chó  sủa ngôn quốc dân phế quá",
        "cmm bede  cay lắm r",
        " chết thảm mà",
        " phế vãi chó 🤣🤣"
    ];

    for (const text of content) {
      if (stopFlag) {
        break;
      }

      for (const { userID, userName } of targetUsersInfo) {
        await sendMessageToUser(message, text, userID, userName);
      }
    }

    return message.reply(`Trêu dân ửa thành công:)`);
  } catch (error) {
    console.error(`Lỗi trong hàm onCall: ${error.message}`);
    throw error;
  }
}

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default {
  config,
  onCall,
};
