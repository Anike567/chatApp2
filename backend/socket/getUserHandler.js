const verifyToken = require("../utility/verifyToken");
const { AppDataSource } = require("./../config/data-source");

const getUserHandler = async (data) => {
    const { token } = data;
    const verifiedToken = verifyToken(token);
    const entityManager = AppDataSource.manager;

    if (!verifiedToken) {
        return null;
    }
   
    try {
        const userId = verifiedToken.id;
        const friends = await entityManager
            .createQueryBuilder()
            .select("u") 
            .from("users", "u")
            .innerJoin("friends", "f", "u._id = f.user1 OR u._id = f.user2")
            .where(":userId IN (f.user1, f.user2)", { userId })
            .andWhere("u._id <> :userId", { userId })
            .getRawMany();
        return friends;
    } catch (error) {
        console.error("DB error:", error.message);
        return null;
    }
};

module.exports = getUserHandler;
