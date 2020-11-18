import { ConnectionOptions } from 'typeorm';

export const OrmConfig: ConnectionOptions = {
  type: 'postgres',
  host: process.env.db_postgres_db_host,
  port: parseInt(process.env.db_postgres_db_port),
  username: process.env.db_postgres_db_user || 'postgres',
  password: process.env.db_postgres_db_password || 'hola1234',
  database: process.env.db_postgres_db_name || 'db_name',
  entities: [],
  synchronize: false,
  migrationsRun: true,
  logging: false,
  migrations: [],
  cli: {
    migrationsDir: 'src/schema/migration'
  }
};
