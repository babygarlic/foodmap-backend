import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { RequestMethod } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService)
  const port = configService.get("PORT")
  app.setGlobalPrefix('/api/v1', {
  exclude: [{ path: '', method: RequestMethod.GET }],
});

  await app.listen(port);


}
bootstrap();
