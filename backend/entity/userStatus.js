const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "UserStatus",
    tableName: "user_status", 

    columns: {
        user_id: {
            type: "char",
            length: 36,
            primary: true,
            unique: true,
            nullable: false,
        },
        last_seen: {
            type: "timestamp",
            nullable: false,
        },
        is_online: {
            type: "boolean",
            nullable: false,
            default: false,   // false = offline
        },
    },
});
