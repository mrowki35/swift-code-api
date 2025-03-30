import request from "supertest";
import express from "express";
import delete_record_router from "../../src/routers/DeleteRecordRouter";
import { connectToDb, closeDbPool, executeQuery, executeInsertQuery } from "../../src/db/db";
import { PoolClient } from "pg";

describe("Delete SWIFT Code API Integration Tests", () => {
  const app = express();
  app.use(express.json());
  app.use("/", delete_record_router);

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

  test("DELETE /swift-codes/ should return 400 for missing swiftCode parameter", async () => {
    const response = await request(app).delete("/swift-codes/");
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Missing swiftCode parameter." });
  });

  test("DELETE /swift-codes/:swiftCode should return 404 if SWIFT code does not exist", async () => {
    const response = await request(app).delete("/swift-codes/123");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "SWIFT code not found" });
  });

  test("DELETE /swift-codes/:swiftCode should delete an existing SWIFT code", async () => {

    const testSwiftCode = "TEST1234567";
    await executeInsertQuery(client, "INSERT INTO swift_data(swift_code) VALUES ($1)", [testSwiftCode]);


    const response = await request(app).delete(`/swift-codes/${testSwiftCode}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "SWIFT code deleted successfully" });

    const checkResult = await executeQuery(client, "SELECT * FROM swift_data WHERE swift_code = $1", [testSwiftCode]);
    expect(checkResult.length).toBe(0);
  });

  test("Database connection should not be closed before tests finish", async () => {
    expect(client).toBeDefined();
    expect(client.release).toBeDefined();
  });
});
