const config = {
    name: "menu",
    aliases: ["menu"],
    version: "1.0.0",
    description: "Hiển thị toàn bộ chức năng mà bot có",
    usage: "",
    permissions: [2],
    credits: "XIE"
}

async function onCall({ message, args, userPermissions, language }) {
    const { commandsConfig } = global.plugins;
    const commandName = args[0]?.toLowerCase();

    if (!commandName) {
        let commands = {};
        for (const [key, value] of commandsConfig.entries()) {
            if (!!value.isHidden) continue;
            if (!!value.isAbsolute ? !global.config?.ABSOLUTES.some(e => e == message.senderID) : false) continue;
            if (!value.hasOwnProperty("permissions")) value.permissions = [0, 1, 2];
            if (!value.permissions.some(p => userPermissions.includes(p))) continue;
            if (!commands.hasOwnProperty(value.category)) commands[value.category] = { count: 0, commands: [] };
            commands[value.category].count++;
            commands[value.category].commands.push(value._name && value._name[language] ? value._name[language] : key);
        }

        let list = Object.keys(commands)
            .map((category, index) => `☄️ [ ${index + 1} - ${category.toUpperCase()} ] - [ ${commands[category].count} lệnh ]\n• ${commands[category].commands.join("\n• ")}`)
            .join("\n");

        message.reply(list);
    }
}

export default {
    config,
    onCall
}
