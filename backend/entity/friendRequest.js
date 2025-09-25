const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "FriendsRequest",
  tableName: "friend_requests",

  columns: {
    _id: {
      type: "char",
      length: 36,
      primary: true,
      generated: "uuid",  // matches DEFAULT_GENERATED uuid()
    },

    from: {
      type: "char",
      length: 36,
      nullable: false,
    },

    to: {
      type: "char",
      length: 36,
      nullable: false,
    },
  },


});
