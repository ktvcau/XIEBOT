const config = {
    name: "restart",
    aliases: ["rs", "rest", "reboot"],
    permissions: [2],
    isAbsolute: true
}

async function onCall({ message, getLang }) {
    await message.reply("Tiến hành quá trình khởi động lại...");
    global.restart();
}

export default {
    config,
    onCall
}
