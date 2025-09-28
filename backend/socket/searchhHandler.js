
const User = require('../entity/User');
const { AppDataSource } = require('./../config/data-source');
const searchHandler = async (username,cb)=>{

    
    
    try{
        const userRepository = AppDataSource.getRepository(User);

        const users = await userRepository
                        .createQueryBuilder("users")
                        .where("users.username LIKE :username", { username: `%${username}%` })
                        .getMany();
        cb(users);
    }

    catch(err){
        console.log(err);
    }
}


module.exports = searchHandler;