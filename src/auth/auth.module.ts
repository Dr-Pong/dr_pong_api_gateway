import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt/auth.jwt.strategy';
import { UserRepository } from '../user/user.repository';
import { ProfileImageRepository } from './profile-image.repository';
import { User } from '../user/user.entity';
import { ProfileImage } from './profile-image.entity';
import { JwtStrategyNoname } from './jwt/noname.jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ Strategy: ['jwt', 'jwtNoname'] }),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: {
        expiresIn: +process.env.JWT_EXPIRATION_TIME,
      },
    }),
    TypeOrmModule.forFeature([User, ProfileImage]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    JwtStrategyNoname,
    UserRepository,
    ProfileImageRepository,
  ],
  exports: [JwtModule, JwtStrategy, PassportModule, AuthService],
})
export class AuthModule {}
