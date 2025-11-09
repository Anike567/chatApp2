const { AppDataSource } = require('../config/data-source.js');
const { uuidToBase64UrlSafe } = require('./../utility/base64Encoding.js');
const { master } = require('./../config/redis.js');
const { In } = require("typeorm");


const heartbeat = async (data, cb) => {
  
    try {
    
        // Otherwise check in DB
        const userStatusRepo = AppDataSource.getRepository("UserStatus");

        const usersStatus = await userStatusRepo.find({
            where: { user_id: In (data.usersId) },
           
        });
        
        cb({ error: false, data: usersStatus });
    } catch (err) {
        console.error("Heartbeat error:", err);
        cb({ error: true, message: "Internal Server error occurred" });
    }
};

module.exports = heartbeat;
