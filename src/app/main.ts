import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '../config/config.service';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from '../domain/logger/logger.service';
import { ClassValidationException } from '../domain/exceptions/class-validation.exception';
import { HttpExceptionFilter } from '../domain/exceptions/http-exception.filter';

async function bootstrap() {
  const logger: Logger = new Logger();
  const app = await NestFactory.create(AppModule, {
    logger
  });
  const configService = app.get(ConfigService);
  app.useLogger(logger);
  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        const exception = new ClassValidationException(errors);
        logger.error(exception.toString());

        return exception;
      }
    })
  );

  await app.listen(configService.port);
}
bootstrap();
