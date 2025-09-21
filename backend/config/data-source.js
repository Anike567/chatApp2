require("reflect-metadata");
const { DataSource } = require("typeorm");
require("dotenv").config();
const path = require("path");
const User = require("./../entity/User");
const OfflineMessage = require('./../entity/Message');

const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.HOST_NAME,
  port: parseInt(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false, 
  logging: false,
  entities: [User,OfflineMessage], 
  migrations: [],
  subscribers: [],
});

module.exports = { AppDataSource };
