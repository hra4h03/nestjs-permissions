import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Role } from '@aggregates/user/role/role';
import { User } from '@aggregates/user/user.aggregate';
import { JwtGuard } from '@/auth/guards/JwtGuard';
// import { Config } from '@/web/common/config/config';
import * as dotenv from 'dotenv';

dotenv.config({
  path:
    process.env.NODE_ENV === 'production'
      ? '.env.production'
      : '.env.development',
});

@Module({
  imports: [
    JwtModule.register({
      secret: 'secret', // Config.jwt.secret,
      signOptions: { expiresIn: '15m' }, // Config.jwt.accessTokenExpires },
    }),
    MikroOrmModule.forFeature([User, Role]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtGuard],
  exports: [JwtModule],
})
export class AuthModule {}
