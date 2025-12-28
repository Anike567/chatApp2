const { AppDataSource } = require("../config/data-source");

const checkUndeliveredMessage = async (userId) => {
    console.log(userId);
    try {
        const repo = AppDataSource.getRepository("messages");

        const messages = await repo.query(
            `SELECT *
             FROM messages
             WHERE \`to\` = ?
               AND delivered = false
             ORDER BY created_at ASC`,
            [userId.user_id]
        );
        console.log(messages);
        return {error : false, message : "", data : messages};
    } catch (err) {
        console.error("Error fetching undelivered messages:", err);
        return {error : true, messages : "Something went wrong please refresh it again", data : null};
    }
};

module.exports = checkUndeliveredMessage;
