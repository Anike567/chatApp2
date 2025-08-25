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

findFriendRequest = (data, cb)=>{
    console.log(data);
    const qry = "select * from friend_requests where 'to' = ?";
    connectionPool.query(qry,[data],(err, result)=>{
        console.log(result);
    })
    cb({message : "working"});
}
module.exports = {addFriend,findFriendRequest};
