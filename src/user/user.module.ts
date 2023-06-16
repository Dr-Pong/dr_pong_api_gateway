import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { ProfileImage } from 'src/auth/profile-image.entity';
import { UserController } from './user.controller';
import { ProfileImageRepository } from 'src/auth/profile-image.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User, ProfileImage])],
  providers: [UserService, UserRepository, ProfileImageRepository],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
