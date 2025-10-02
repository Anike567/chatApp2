const { master } = require('./../config/redis');
const { AppDataSource } = require('../config/data-source.js');
const {base64UrlSafeToUuid } = require('./../utility/base64Encoding.js');

const onDisconnect = async (socket) => {
    try {
        const encodedUserId = await master.get(socket.id);
        if (encodedUserId) {
            const userStatusRepo = AppDataSource.getRepository("UserStatus");

            const userId = base64UrlSafeToUuid(encodedUserId); 

            // update DB
            await userStatusRepo.upsert(
                {
                    user_id: userId,
                    is_online: false,
                    last_seen: new Date(),
                },
                ["user_id"]
            );

            // clean up Redis
            await master.del(encodedUserId); 
            await master.del(socket.id);     
        }
    } catch (err) {
        console.error("Disconnect error:", err);
    }
};

module.exports = onDisconnect;
