const { AppDataSource } = require('../config/data-source.js');
const { uuidToBase64UrlSafe } = require('./../utility/base64Encoding.js');
const { master } = require('./../config/redis.js');

const heartbeat = async (data, cb) => {
    try {
        // Check in Redis (fast lookup)
        const isUserOnline = await master.exists(uuidToBase64UrlSafe(data.userId));

        if (isUserOnline) {
            cb({
                error: false,
                data: {
                    is_online: true,
                    last_seen: null
                }
            });
            return;
        }

        // Otherwise check in DB
        const userStatusRepo = AppDataSource.getRepository("UserStatus");

        const userStatus = await userStatusRepo.findOne({
            where: { user_id: data.userId },
            select: ["last_seen", "is_online"]
        });

        cb({ error: false, data: userStatus });
    } catch (err) {
        console.error("Heartbeat error:", err);
        cb({ error: true, message: "Internal Server error occurred" });
    }
};

module.exports = heartbeat;
