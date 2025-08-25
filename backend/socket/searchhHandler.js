const connectionPool = require('./../config/connection');
const searchHandler = (username,cb)=>{
    const quer = "SELECT * FROM users WHERE name LIKE ?";

    connectionPool.query(quer,[`%${username}%`],(err,results)=>{
        if(err){
            console.log(err);
        }

        cb(results);
        return;
    })
}


module.exports = searchHandler;