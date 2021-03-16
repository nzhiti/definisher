const config = {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false,
    define: {
        timestamps: true,
        paranoid: false,
        underscored: true,
        freezeTableName: false,
    },
};

module.exports = config;