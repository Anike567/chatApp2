const { master } = require('./../config/redis');
const { AppDataSource } = require('../config/data-source.js');
const {uuidToBase64UrlSafe} = require('./../utility/base64Encoding');

const updateSocketId = async (data) => {
    try {
        let { userId, socketid } = data;
        const userStatusRepo = AppDataSource.getRepository("UserStatus");
        await userStatusRepo.upsert(
            {
                user_id: userId,
                is_online: true,
                last_seen: new Date(),
            },
            ["user_id"]  
        );

        userId = uuidToBase64UrlSafe(userId);
        await master.set(userId, socketid);
        await master.set(socketid, userId);

    }
    catch (err) {
        console.log(err);
    }
}


module.exports = updateSocketId;