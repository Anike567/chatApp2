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
          console.log("uloaded successfully");
          cb({error: false,msg:"dp uploaded successfully"});
        });
      } else {
        cb("User not found");
      }
    });
  } catch (err) {
    console.log(err);
    cb({error: true,msg:"An Unknown Error Occured please try again later"});
  }
};

module.exports = uploadFile;
