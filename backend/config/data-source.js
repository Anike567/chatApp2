require("reflect-metadata");
const { DataSource } = require("typeorm");
const User = require("./../entity/User");
const OfflineMessage = require('./../entity/Message');
const Friends = require('./../entity/friends');
const FriendsRequest = require('./../entity/friendRequest');
const UserStatus = require('./../entity/userStatus');
const UnsendMessage = require('./../entity/Message');
require('dotenv').config();

const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.HOST_NAME || "mysql-24f6f700-ka344057-2e6f.h.aivencloud.com",
  port: parseInt(process.env.PORT) || 28350,
  username: process.env.DB_USER || "avnadmin",
  password: process.env.DB_PASSWORD || "AVNS_fzJBIo8G61SiTJK-ETC",
  database: process.env.DB_NAME || "chatApp",
  synchronize: false, 
  logging: false,
  entities: [User,OfflineMessage, Friends,FriendsRequest, UserStatus], 
  migrations: [],
  subscribers: [],
});


module.exports = { AppDataSource };
