const connectionPool = require('./../config/connection');

const uploadFile = (data, cb) => {


    let qry = "SELECT * FROM users WHERE _id = ?";

    try {
        connectionPool.query(qry, [data._id], (err, result) => {
            if (err) {
                throw err;
            }

            if (result.length > 0) {
                qry = "UPDATE users SET dp = ? WHERE _id = ?";
                connectionPool.query(qry, [data.fileData, data._id], (err, result) => {
                    if (err) {
                        throw err;
                    }
                    
                    cb({ error: false, msg: "dp uploaded successfully" });
                });
            } else {
                throw new Error("Something went wrong please try later");
            }
        });
    } catch (err) {
        cb({ error: true, msg: "Something went wrong please try later " });
    }
};

module.exports = uploadFile;
