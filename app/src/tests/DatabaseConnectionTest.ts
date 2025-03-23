import { Pool } from 'pg';

const pool = new Pool({
    user: 'admin',
    host: 'localhost',
    database: 'swift_db',
    password: 'password',
    port: 5432,
});

async function queryDatabase() {
    const client = await pool.connect();
    try {
        const res = await client.query('SELECT * FROM swift_data WHERE country_iso2_code = $1', ['AL']);
        console.log(res.rows); 
    } catch (err:any) {
        console.error('Query error:', err.stack);
    } finally {
        client.release();  
    }
}

queryDatabase().catch(console.error);
