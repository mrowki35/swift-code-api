import request from "supertest";
import express from "express";
import swift_code_router from "../../src/routers/GetBySwiftCodeRouter";
import { connectToDb, closeDbPool } from "../../src/db/db";
import { PoolClient } from "pg";

describe("Banks by SwiftCode Integration Tests", () => {
  const app = express();
  app.use(express.json());
  app.use("/", swift_code_router);

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

  test("GET /swift-codes/ should return 400 for missing swiftCode parameter", async () => {
    const response = await request(app).get("/swift-codes/");
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Missing swiftCode parameter." });
  });

  test("GET /swift-codes/:swiftCode should return real database data if swift code exists", async () => {
    const validSwiftCode = "PTFIPLPWFMS";

    const response = await request(app).get(`/swift-codes/${validSwiftCode}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("swiftCode", validSwiftCode);
    expect(response.body).toHaveProperty("bankName");
    expect(response.body).toHaveProperty("countryISO2");
  });

  test("GET /swift-codes/:swiftCode should return 404 if SWIFT code does not exist", async () => {
    const response = await request(app).get("/swift-codes/NONEXISTENT123");

    expect(response.status).toBe(204);
  });

  test("Database connection should not be closed before tests finish", async () => {
    expect(client).toBeDefined();
    expect(client.release).toBeDefined();
  });
});
