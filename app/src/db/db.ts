import { Pool, PoolClient } from "pg";

const pool = new Pool({
  user: "admin",
  host: "localhost",
  database: "swift_db",
  password: "password",
  port: 5432,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on("connect", () => {
  console.debug("Connected to PostgreSQL)");
});

export const connectToDb = async (): Promise<PoolClient> => {
  try {
    const client = await pool.connect();
    return client;
  } catch (err) {
    console.error(`Error connecting to PostgreSQL: ${err}`);
    throw err;
  }
};

export const closeDbPool = async () => {
  await pool.end();
  console.debug("PostgreSQL connection pool closed.");
};

export default pool;

export const executeQuery = async (
  conn: PoolClient,
  sql: string,
  params: any[],
): Promise<any[]> => {
  try {
    const { rows } = await conn.query(sql, params);
    return rows;
  } catch (err) {
    console.error(`executeQuery Error: ${err}`);
    throw err;
  }
};
