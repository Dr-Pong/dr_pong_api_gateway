import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GatewayModule } from './gateway/gateway.module';
import { TestModule } from './test/test.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './configs/typeorm.configs';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { DataSource } from 'typeorm';
import { UserModule } from './user/user.module';
import { ProfileImageRepository } from './auth/profile-image.repository';
import { ProfileImage } from './auth/profile-image.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory() {
        return typeORMConfig;
      },
      async dataSourceFactory(options) {
        if (!options) {
          throw new Error('Invalid options passed');
        }
        return addTransactionalDataSource({
          dataSource: new DataSource(options),
        });
      },
    }),
    GatewayModule,
    TestModule,
    AuthModule,
    UserModule,
    TypeOrmModule.forFeature([ProfileImage]),
  ],
  controllers: [AppController],
  providers: [AppService, ProfileImageRepository],
})
export class AppModule {}
