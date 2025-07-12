const bcrypt = require('bcrypt');
const saltRound = 10;

const hashPassword = (password)=>{
    return new Promise((resolve,reject)=>{
        bcrypt.hash(password,saltRound,(err,results)=>{
            if(err){
                reject(err);
            }
            resolve(results);
        })
    })
}

module.exports = hashPassword;