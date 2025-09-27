
const messages = require("../entity/messageStore");
const verifyToken = require("../utility/verifyToken");
const { AppDataSource } = require("./../config/data-source");
const { In } = require("typeorm");

const addFriend = async (param, cb) => {
    const { token, data } = param;

    const isVerified = verifyToken(token);

    if (verifyToken) {
        try {

            const friendRequestRepo = AppDataSource.getRepository("FriendsRequest");
            const res = await friendRequestRepo.save(data);
            cb({ error: false, statusCode : 200,message: "Friend request sent " })
        }
        catch (err) {
            console.log(err);
            cb({ error: true, statusCode: 500, message: "Internal Server Error occured" });

        }
    }
    else{
        cb({error : true, messages : "Token is missing of expired please login again"});
    }

};

const findFriendRequest = async (payload, cb) => {
    const friendRequestRepo = AppDataSource.getRepository("FriendsRequest");
    const userRepository = AppDataSource.getRepository("User");
    const { data, token } = payload;
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
    const { token, to, from } = data;
    const friendRequestRepo = AppDataSource.getRepository("FriendsRequest");
    const frRepository = AppDataSource.getRepository("Friends");

    const verifiedToken = verifyToken(token);

    if (!verifiedToken) {
        return cb({
            error: true,
            messages: 'Token is expired or missing, please login again'
        });
    }

    try {
        // Find request between these two users
        const friendRequests = await friendRequestRepo.find({
            where: [
                { to: to, from: from },
                { to: from, from: to }
            ]
        });

        if (friendRequests.length > 0) {
            // Delete the friend requests
            await friendRequestRepo.remove(friendRequests);

            // Save the friendship
            await frRepository.save({ user1: from, user2: to });

            return cb({ error: false, messages: "Accepted" });
        } else {
            return cb({ error: true, messages: "No friend request found" });
        }
    } catch (err) {
        console.error(err);
        return cb({
            error: true,
            messages: 'Internal Server Error occurred, try again later'
        });
    }
};

module.exports = { addFriend, findFriendRequest, acceptFriendRequest };
