import { connectToDb, closeDbPool, executeQuery, executeInsertQuery, executeDeleteQuery } from "../../src/db/db";
import { PoolClient } from "pg";

describe("Database Integration Tests", () => {
  let client: PoolClient;

  beforeAll(async () => {
    client = await connectToDb();
  });

  afterAll(async () => {
    client.release();
    await closeDbPool();
  });

  test("Should connect to the database", async () => {
    expect(client).toBeDefined();
  });

  test("Should execute a SELECT query", async () => {
    const sql = "SELECT 1 AS result";
    const result = await executeQuery(client, sql, []);
    expect(result).toEqual([{ result: 1 }]);
  });

  test("Should insert a record into the test table", async () => {
    const insertSql = "INSERT INTO swift_data VALUES ($1) RETURNING *";
    const result = await executeInsertQuery(client, insertSql, ["XX"]);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].country_iso2_code).toBe("XX");
  });

  test("Should delete a record from the test table", async () => {
    const deleteSql = "DELETE FROM swift_data WHERE country_iso2_code = $1";
    const result = await executeDeleteQuery(client, deleteSql, ["XX"]);
    expect(result.rowCount).toBeGreaterThanOrEqual(0);
  });
});
