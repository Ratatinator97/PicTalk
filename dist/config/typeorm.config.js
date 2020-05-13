"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeOrmConfig = void 0;
const config = require("config");
const dbConfig = config.get('db');
exports.typeOrmConfig = {
    type: dbConfig.type,
    host: process.env.DATABASE_URL || dbConfig.host,
    port: process.env.RDS_PORT || dbConfig.port,
    username: process.env.user || dbConfig.username,
    password: process.env.password || dbConfig.password,
    database: process.env.DB_NAME || dbConfig.database,
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    synchronize: process.env.TYPEORM_SYNC || dbConfig.synchronize,
};
//# sourceMappingURL=typeorm.config.js.map