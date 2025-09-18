import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from 'src/module/user/user.service';
import { UserModule } from 'src/module/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync ({
      useFactory: async (configService:ConfigService) => ({
        secret: configService.get<string>("SECRECT_KEY"),
        signOptions: {
          expiresIn: configService.get<string>("ACCESS_TOKEN_EXPIRES"),
        }
      }),
      inject:[ConfigService],
    })
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService ]
})
export class AuthModule {}
