import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeORMConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'jyp', // postgres
  password: 'postgres',
  database: 'auth',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true,
  poolSize: 10,
};
