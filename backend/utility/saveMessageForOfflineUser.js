const connectionPool = require('./../config/connection');

const saveOfflineMessage = (payload) => {
    const qry = 'INSERT INTO offline_message (`to`, `from`, delivered, message) VALUES (?, ?, ?, ?)';
    const {to, from, delivered, message} = payload;
    connectionPool.query(qry, [to, from, delivered, message], (err, result) => {
        if (err) {
            console.error("Error inserting message:", err);
        } else {
            console.log("Message saved:", result.insertId);
        }
    });
};


module.exports = saveOfflineMessage;