import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeORMConfig: TypeOrmModuleOptions = {
  name: 'api',
  type: 'postgres',
  host: 'api-db',
  port: 5432,
  username: process.env.API_DB_USER,
  password: process.env.API_DB_PASSWORD,
  database: process.env.API_DB_NAME,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true,
  poolSize: 10,
};
