import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppConfig } from './config/AppConfig';
import { Logger, VERSION_NEUTRAL, VersioningType } from '@nestjs/common';
import  cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const applicationConfig = app.get<AppConfig>(AppConfig);
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: VERSION_NEUTRAL,
  });

  app.use(cookieParser());

  const logger = new Logger('Bootstrap');

  const config = new DocumentBuilder()
    .setTitle('Nest Authorization')
    .setDescription('Nest authorization app')
    .setVersion('0.1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () =>
    SwaggerModule.createDocument(app, config, {
      operationIdFactory(_controllerKey, methodKey) {
        return methodKey;
      },
    });
  SwaggerModule.setup('swagger', app, documentFactory, {
    jsonDocumentUrl: 'swagger/json',
    yamlDocumentUrl: 'swagger/yaml',
    explorer: false,
    customCss: /*css*/ `
        .swagger-ui .opblock .opblock-summary-operation-id {
          font-size: 14px;
          color: rebeccapurple;
          line-break: normal;
          white-space: nowrap;
          margin-right: 10px;
        }
      `,
    swaggerOptions: {
      displayOperationId: true,
      persistAuthorization: true,
    },
  });

  await app.listen(applicationConfig.port);
  logger.log(`App listening at http://localhost:${applicationConfig.port}`);
}
bootstrap();
