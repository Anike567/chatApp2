
const messages = require("../entity/messageStore");
const verifyToken = require("../utility/verifyToken");
const { AppDataSource } = require("./../config/data-source");
const { In } = require("typeorm");

const addFriend = async (data, cb) => {
    try {

        const friendRequestRepo = AppDataSource.getRepository("FriendsRequest");
        const res = await friendRequestRepo.save(data);
        cb({ error: false, message: "Friend request sent " })
    }
    catch (err) {
        console.log(err);
        cb({ error: true, message: "Internal Server Error occured" });

    }
};

const findFriendRequest = async (payload, cb) => {
    const friendRequestRepo = AppDataSource.getRepository("FriendsRequest");
    const userRepository = AppDataSource.getRepository("User");
    const { data, token } = payload;
    console.log(data)
    const verifiedToken = verifyToken(token);

    if (!verifiedToken) {
        return cb({
            error: true,
            message: "Token is expired or missing, please login again",
        });
    }

    try {
        // 1️⃣ Find all friend requests where the user is the recipient (`to`)
        const requests = await friendRequestRepo.find({ where: { to: data } });

        // 2️⃣ Extract all sender IDs (`from`) and remove duplicates
        const userIds = [...new Set(requests.map(req => req.from))];

        if (userIds.length === 0) {
            return cb({ error: false, data: [] });
        }

        // 3️⃣ Fetch all user objects for those IDs
        const users = await userRepository.find({
            where: { _id: In(userIds) },
        });

        // 4️⃣ Return result
        cb({ error: false, data: users });
    } catch (err) {
        console.error(err);
        cb({
            error: true,
            message: "Internal server error, please try again later",
        });
    }
};


const acceptFriendRequest = async (data, cb) => {
    const { token, user1, user2 } = data;
    const friendRequestRepo = AppDataSource.getRepository("FriendsRequest");
    const frRepository = AppDataSource.getRepository("Friends");

    const verifiedToken = verifyToken(token);

    if (verifiedToken) {
        try {
            const res = await frRepository.save({ user1, user2 });
            cb({ error: false, messages: "Accepted" });
        }

        catch (err) {
            console.log(err);
            cb({ error: true, messages: 'Internal Sever error occured try again later' });
        }

    }
    else {
        cb({ error: true, messages: 'token is expired or missing please login again' });
    }
}

module.exports = { addFriend, findFriendRequest, acceptFriendRequest };
