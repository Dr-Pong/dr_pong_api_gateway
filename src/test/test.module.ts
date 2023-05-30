import { Module } from '@nestjs/common';
import { TestService } from './test.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { ProfileImage } from 'src/auth/profile-image.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, ProfileImage]), AuthModule],
  providers: [TestService],
  exports: [TestService, TypeOrmModule.forFeature([User, ProfileImage])],
})
export class TestModule {}
