import dotenv from "dotenv";

dotenv.config();

const Config = {
  user: process.env.POSTGRES_USER || "admin",
  host: process.env.DB_HOST || "postgres",
  database: process.env.POSTGRES_DB || "swift_db",
  password: process.env.POSTGRES_PASSWORD || "password",
  db_port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  app_port: process.env.APP_PORT ? parseInt(process.env.APP_PORT, 10) : 8080,
};

export default Config;
