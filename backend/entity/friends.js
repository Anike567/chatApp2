const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Friends",
  tableName: "friends",

  columns: {
    _id: {
      type: "char",
      length: 36,
      primary: true,
      generated: "uuid",  
    },

    user1: {
      type: "char",
      length: 36,
      nullable: false,
    },

    user2: {
      type: "char",
      length: 36,
      nullable: false,
    },
  },

  indices: [
    {
      name: "IDX_user1",
      columns: ["user1"],
    },
    {
      name: "IDX_user2",
      columns: ["user2"],
    },
  ],
});
