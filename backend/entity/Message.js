    const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "OfflineMessage",
    tableName: "offline_message",

    columns: {
        _id: {
            type: "char",
            length: 36,
            primary: true,
            generated: "uuid", // TypeORM generates UUID in JS
        },
        to_user: {
            name: "to", // actual DB column name
            type: "char",
            length: 36,
            nullable: false,
        },
        from_user: {
            name: "from", // actual DB column name
            type: "char",
            length: 36,
            nullable: false,
        },
        delivered: {
            type: "varchar",
            length: 20,
            nullable: true,
        },
        message: {
            type: "mediumtext", // ✅ correct MySQL type
            nullable: false,
        },
        created_at: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
            nullable: false,
        },
    },
});
