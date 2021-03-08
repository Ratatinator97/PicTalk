import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as config from 'config';
import * as helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';
import * as compression from 'compression';
// somewhere in your initialization file

async function bootstrap() {
  const serverConfig = config.get('server');
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);
  app.use(compression());
  console.log('Node environment is :', process.env.NODE_ENV);
  if (process.env.NODE_ENV === 'development') {
    console.log('Enabled open CORS');
    app.enableCors();
  } else {
    app.use(helmet());
    app.use(
      rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 2000,
      }),
    );
    console.log('Enabled production CORS');
    app.enableCors({
      origin: ['https://www.pictalk.xyz','https://beta.pictalk.xyz'],
      methods: 'GET,PUT,POST,DELETE,OPTIONS',
    });
  }
  const port = process.env.PORT || serverConfig.port;
  await app.listen(port);
  logger.log(`Application listening on port ${port}`);
}
bootstrap();
