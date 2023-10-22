import * as dotenv from 'dotenv';
import { join } from 'path';
import { DataSource } from 'typeorm';

dotenv.config({ path: join(__dirname, '../../../.env') });

const PostgresDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: process.env.DATABASE_PORT ? parseInt(process.env.DATABASE_PORT) : 5432,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  logging: false,
  database: process.env.DATABASE_NAME,
  entities: [__dirname + '/../../**/*.entity.{ts,js}'],
  migrations: [__dirname + '/../migrations/**/*{.ts,.js}'],
  migrationsRun: true,
  synchronize: true,
});

export default PostgresDataSource;
