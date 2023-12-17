import fs from 'fs';

const config = {
    name: "thall",
    aliases: ["xie", "vadi"],
    description: "Quản lý người dùng trong nhóm",
    permissions: [2],
    usage: "Sử dụng lệnh để thêm, xóa, liệt kê người dùng và tag toàn bộ",
    credits: "XIE",
};

async function getUserName(userID) {
    return new Promise((resolve, reject) => {
        global.api.getUserInfo([userID], (err, result) => {
            if (err) return reject(err);
            const userName = result[userID]?.name || '';
            resolve(userName);
        });
    });
}

async function saveToUserDatabase(userID) {
    const jsonFile = 'userDatabase.json';
    let userData = {};

    try {
        const fileExists = fs.existsSync(jsonFile);

        if (fileExists) {
            const jsonContent = fs.readFileSync(jsonFile, 'utf8');
            userData = JSON.parse(jsonContent);
        }
    } catch (error) {
        console.error();
    }

    if (!userData.users) {
        userData.users = [];
    }

    const existingUser = userData.users.find(user => user.id === userID);
    if (!existingUser) {
        const userName = await getUserName(userID);
        userData.users.push({ id: userID, name: userName });

        try {
            fs.writeFileSync(jsonFile, JSON.stringify(userData, null, 2), 'utf8');
        } catch (error) {
            console.error();
        }
    }
}

function getListUsers() {
    const jsonFile = 'userDatabase.json';
    let userData = {};

    try {
        const fileExists = fs.existsSync(jsonFile);

        if (fileExists) {
            const jsonContent = fs.readFileSync(jsonFile, 'utf8');
            userData = JSON.parse(jsonContent);
        }
    } catch (error) {
        console.error();
    }

    return userData.users || [];
}

async function adduser(userID, threadID, username) {
    return new Promise((resolve, reject) => {
        global.api.addUserToGroup(userID, threadID, (err) => {
            if (err) return reject(err);
            resolve();
        });
    });
}

function removeUserByIndex(index) {
    const jsonFile = 'userDatabase.json';
    let userData = {};

    try {
        const jsonContent = fs.readFileSync(jsonFile, 'utf8');
        userData = JSON.parse(jsonContent);
    } catch (error) {
        console.error();
    }

    if (userData.users) {
        if (index >= 0 && index < userData.users.length) {
            userData.users.splice(index, 1);

            try {
                fs.writeFileSync(jsonFile, JSON.stringify(userData, null, 2), 'utf8');
            } catch (error) {
                console.error();
            }
        }
    }
}

function getListUsersString(page = 1, pageSize = 5) {
    const userList = getListUsers();
    const totalUsers = userList.length;
    const totalPages = Math.ceil(totalUsers / pageSize);

    const startIdx = (page - 1) * pageSize;
    const endIdx = startIdx + pageSize;
    const displayedUsers = userList.slice(startIdx, endIdx);

    if (displayedUsers.length > 0) {
        const userListString = displayedUsers.map((user, index) =>
            `[ ${index + startIdx + 1} ]\n- Fullname: ${user.name}\n- ID: ${user.id}\n\n`
        ).join('\n');

        return `${userListString}\n[ Người dùng ${totalPages} ]\nSử dụng next [Số trang] để xem trang tiếp theo`;
    } else {
        return 'Dữ liệu đang trống.';
    }
}

// async function listNext(message, threadID, currentPage) {
//     const totalUsers = getListUsers().length;
//     const totalPages = Math.ceil(totalUsers / 10);

//     if (currentPage < totalPages) {
//         const nextPage = currentPage + 1;
//         const userListString = getListUsersString(nextPage);
//         await message.send(`Danh sách trang [ ${nextPage}/${totalPages} ]\n\n${userListString}`, threadID);
//     } else {
//         await message.send("Bạn đã ở trang cuối cùng.", threadID);
//     }
// }

async function tagAllUsers(message, threadID) {
    const userList = getListUsers();
    const userIDsToAdd = userList.map(user => user.id);

    try {
        await addMultipleUsers(userIDsToAdd, threadID);
        const messageContent = "AE tới rồi!!";
        if (messageContent.trim() !== "") {
            await message.send({ body: messageContent }, threadID);
        } else {
            console.error();
        }
    } catch (error) {
        console.error();
    }
}

async function addMultipleUsers(userIDs, threadID) {
    return new Promise((resolve, reject) => {
        global.api.addUserToGroup(userIDs, threadID, (err) => {
            if (err) return reject(err);
            resolve();
        });
    });
}

async function addAllUsers(message, threadID) {
    const userList = await getAllUsersInThread(threadID);

    for (const user of userList) {
        try {
            await saveToUserDatabase(user.id);
            await adduser(user.id, user.name);
        } catch (error) {
            console.error();
        }
    }
}

async function getAllUsersInThread(threadID) {
    return new Promise((resolve, reject) => {
        global.api.getThreadInfo(threadID, (err, result) => {
            if (err) return reject(err);
            const userList = result.participantIDs.map(id => ({ id, name: result.nicknames[id] || '' }));
            resolve(userList);
        });
    });
}

async function showHelp(message, threadID) {
    const helpMessage = `
***Hướng dẫn***
- add [userID/all]: Thêm người dùng vào danh sách.
- remove [STT/all]: Xóa người dùng khỏi danh sách.
- list: Hiển thị danh sách người dùng.
- next [số trang]: Xem danh sách người dùng ở trang tiếp theo.
- tag: Thêm những người thân vào nhóm.
- help: Hiển thị trợ giúp về lệnh [ thall ].

***Lưu ý***
Khi sử dụng add all: Đợi nó load 1 thời gian nhất định để thêm toàn bộ người dùng vào. Đợi kết quả thông báo thành công rồi mới tiếp tục.
    `;
    await message.send(helpMessage, threadID);
}

// let currentPage = 0;

function getPageFromMessage(messageContent) {
    const match = messageContent.match(/\[(\d+)\]/);
    return match ? parseInt(match[1]) : 1;
}

async function onCall({ message, args }) {
    if (!message.isGroup) return;

    const { threadID, senderID, messageID } = message;

    try {
        if (senderID !== "100056565229471") {
            await message.reply("Óc cặc đòi dùng !!");
            return;
        }

        const command = args[0]?.toLowerCase();
        const input = args.slice(1).join(" ").toLowerCase();

        if (command === 'add' && input) {
            if (input === 'all') {
                await addAllUsers(message, threadID);
                await message.send(`Đã thêm toàn bộ thành viên vào danh sách.`, threadID);
            } else {
                let uidToAdd = !isNaN(input) ? input : null;

                if (!uidToAdd || isNaN(uidToAdd)) {
                    const repliedMessage = await global.api.getMessageInfo(messageID);
                    const repliedUserID = repliedMessage?.participant || null;

                    if (repliedUserID) {
                        uidToAdd = repliedUserID;
                    } else {
                        throw new Error("ID không hợp lệ.");
                    }
                }

                await saveToUserDatabase(uidToAdd);
                const addedUserName = await getUserName(uidToAdd);
                await message.send(`Người dùng ${addedUserName} đã được thêm vào danh sách.`, threadID);
            }
        } else if (command === 'add' && !input) {
            await message.reply("Vui lòng cung cấp ID người dùng hoặc sử dụng 'all' để thêm tất cả thành viên.");
        }

        if (command === 'remove' && input) {
            if (input.toLowerCase() === 'all') {
                const jsonFile = 'userDatabase.json';
                try {
                    fs.writeFileSync(jsonFile, JSON.stringify({}, null, 2), 'utf8'); 
                    await message.send('Đã xóa tất cả người dùng khỏi danh sách.', threadID);
                } catch (error) {
                    console.error();
                    await message.send('Đã xảy ra lỗi khi xóa tất cả người dùng.', threadID);
                }
            } else {
                let uidToRemove = !isNaN(input) ? input : null;

                if (!uidToRemove || isNaN(uidToRemove)) throw new Error("Số thứ tự không hợp lệ.");

                const jsonFile = 'userDatabase.json';
                let userData = {};

                try {
                    const jsonContent = fs.readFileSync(jsonFile, 'utf8');
                    userData = JSON.parse(jsonContent);
                } catch (error) {
                    console.error();
                }

                const indexToRemove = uidToRemove - 1;

                if (indexToRemove >= 0 && indexToRemove < userData.users.length) {
                    const removedUserName = userData.users[indexToRemove]?.name || '';
                    removeUserByIndex(indexToRemove);
                    await message.send(`Người dùng ${removedUserName} đã được xóa khỏi danh sách.`, threadID);
                } else {
                    await message.send(`Số thứ tự không hợp lệ.`, threadID);
                }
            }
        }

        if (command === 'list') {
            const page = parseInt(input.split(' ')[1]) || 1;
            const userListString = getListUsersString(page);
            const totalUsers = getListUsers().length;
            const totalPages = Math.ceil(totalUsers / 10);
            await message.send(`Tổng số người dùng [ ${totalUsers} ]\nTổng số trang [ ${totalPages} ]`, threadID);
        } else if (command === 'next') {
            const totalUsers = getListUsers().length;
            const totalPages = Math.ceil(totalUsers / 10);

            const match = input.match(/\d+/); 
            const requestedPage = match ? parseInt(match[0]) : 1;

            if (requestedPage > 0 && requestedPage <= totalPages) {
                const userListString = getListUsersString(requestedPage);
                await message.send(`Danh sách trang [ ${requestedPage}/${totalPages} ]:\n\n${userListString}`, threadID);
                currentPage = requestedPage;
            } else {
                await message.send(`Số trang không tồn tại.`, threadID);
            }
        }

        if (command === 'tag') {
            await tagAllUsers(message, threadID);
        }

        if (command === 'help') {
            await showHelp(message, threadID);
        }

    } catch (e) {
        console.error();
    }
}

export default {
    config,
    onCall
};
