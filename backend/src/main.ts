import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
// import * as csurf from 'csurf';
// import {nestCsrf} from 'ncsrf'

async function launchApplication() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  app.use(helmet());
  app.use(cookieParser());
  // app.use(csurf({ cookie: true })); // NEED TO 
  // app.use(nestCsrf());
  await app.listen(3000);
}

launchApplication();