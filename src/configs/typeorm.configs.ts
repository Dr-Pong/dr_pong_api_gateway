import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeORMConfig: TypeOrmModuleOptions = {
  name: 'api',
  type: 'postgres',
  host: 'api-db',
  port: 5432,
  username: 'postgres', // postgres
  password: 'postgres',
  database: 'auth',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true,
  poolSize: 10,
};
