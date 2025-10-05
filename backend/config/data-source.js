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
  host: process.env.HOST_NAME,
  port: parseInt(process.env.PORT) || 3306,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false, 
  logging: false,
  entities: [User,OfflineMessage, Friends,FriendsRequest, UserStatus], 
  migrations: [],
  subscribers: [],
});

module.exports = { AppDataSource };
