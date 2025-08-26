const connectionPool = require("../config/connection");

const addFriend = (data, cb) => {
    console.log(data);

    const qry = "INSERT INTO friend_requests (`from`, `to`) VALUES (?, ?)";

    connectionPool.query(qry, [data.from, data.to], (err, result) => {
        if (err) {
            console.error("MySQL Error:", err.sqlMessage); // <-- better debug
            cb({ error: true, message: "Something went wrong" });
            return;
        }

        cb({ error: false, message: "Friend request sent successfully" });
    });
};

findFriendRequest = (data, cb) => {
    console.log("findFriendRequest input:", data, typeof data);

    let qry = "select `from` from friend_requests where `to` = ?";
    connectionPool.query(qry, [data], (err, result) => {
        if (err) {
            console.error("MySQL Error:", err);
            cb({ error: true, message: 'Something went wrong please try again later' });
            return;
        }

        // Extract ids
        const fromIds = result.map(r => r.from);
        if (fromIds.length === 0) {
            cb({ error: false, data: [] });
            return;
        }

        qry = "select * from users where _id in (?)";
        connectionPool.query(qry, [fromIds], (err, users) => {
            if (err) {
                console.error("MySQL Error:", err);
                cb({ error: true, message: 'Something went wrong please try again later' });
                return;
            }

            console.log(users); // ✅ correct variable
            cb({ error: false, data: users });
        });
    });
};


module.exports = { addFriend, findFriendRequest };
