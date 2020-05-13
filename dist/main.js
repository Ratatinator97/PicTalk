"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const config = require("config");
async function bootstrap() {
    const serverConfig = config.get('server');
    const logger = new common_1.Logger('bootstrap');
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    console.log('Node environment is :', process.env.NODE_ENV);
    if (process.env.NODE_ENV === 'development') {
        console.log('Enabled CORS');
        app.enableCors();
    }
    const port = process.env.PORT || serverConfig.port;
    await app.listen(port);
    logger.log(`Application listening on port ${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map