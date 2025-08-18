const connectionPool = require('./../config/connection');
const searchHandler = (username,cb)=>{
    const quer = "select * from users where username = ?";
    console.log(username);
    connectionPool.query(quer,[username],(err,results)=>{
        if(err){
            console.log(err);
        }

        cb(results);
    })
}


module.exports = searchHandler;