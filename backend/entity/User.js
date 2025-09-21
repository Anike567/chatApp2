const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "User",
  tableName: "users",
  columns: {
    _id: {
      type: "char",
      length: 36,
      primary: true,
    },
    name: {
      type: "varchar",
      length: 100,
    },
    username: {
      type: "varchar",
      length: 50,
      unique: true,
    },
    email: {
      type: "varchar",
      length: 100,
      unique: true,
    },
    contact: {
      type: "varchar",
      length: 10,
      unique: true,
    },
    password: {
      type: "varchar",
      length: 255,
    },
    created_at: {
      type: "timestamp",
      createDate: true, // auto timestamp
    },
    dp: {
      type: "mediumblob",
      nullable: true,
    },
  },
});
