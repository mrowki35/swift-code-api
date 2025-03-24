import { Pool, PoolClient } from "pg";


const pool = new Pool({
    user: 'admin',
    host: 'localhost',
    database: 'swift_db',
    password: 'password',
    port: 5432,
  max: 10, 
  idleTimeoutMillis: 30000, 
  connectionTimeoutMillis: 2000, 
});


export const connectToDb = async (): Promise<PoolClient> => {
  try {
    const client = await pool.connect();
    console.debug("Connected to PostgreSQL with connection pooling");
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

export const executeQuery = async (conn: Promise<PoolClient>, sql: string, params: any[]): Promise<any[]> => {
  try {
    const client = await conn; 
    const { rows } = await client.query(sql, params);
    return rows;
  } catch (err) {
    console.error(`executeQuery Error: ${err}`);
    throw err;
  }
};

