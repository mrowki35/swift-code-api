import request from "supertest";
import express from "express";
import put_swift_code_router from "../../src/routers/PostSwiftCodeRouter";
import { connectToDb, closeDbPool, executeQuery, executeInsertQuery } from "../../src/db/db";
import { PoolClient } from "pg";

describe("Post SWIFT Code API Integration Tests", () => {
  const app = express();
  app.use(express.json());
  app.use("/", put_swift_code_router);

  let client: PoolClient;

  beforeAll(async () => {
    client = await connectToDb();
  });

  afterAll(async () => {
    client.release();
    await closeDbPool();
  });

  const validSwiftCodeData = {
    address: "123 Bank Street",
    bankName: "Test Bank",
    countryISO2: "US",
    countryName: "United States",
    isHeadquarter: true,
    swiftCode: "TESTBANK",
  };

  test("Should connect to the database", async () => {
    expect(client).toBeDefined();
  });

  test("POST /swift-codes should return 400 for missing required fields", async () => {
    const { bankName, ...incompleteData } = validSwiftCodeData;

    const response = await request(app).post("/swift-codes").send(incompleteData);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Missing required fields" });
  });

  test("POST /swift-codes should return 400 for invalid country ISO2 code", async () => {
    const invalidData = { ...validSwiftCodeData, countryISO2: "USA" };

    const response = await request(app).post("/swift-codes").send(invalidData);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Invalid country ISO2 code. It must be exactly 2 characters.",
    });
  });

  test("POST /swift-codes should return 400 for invalid isHeadquarter value", async () => {
    const invalidData = { ...validSwiftCodeData, isHeadquarter: "not_boolean" };

    const response = await request(app).post("/swift-codes").send(invalidData);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Invalid isHeadquarter value. It must be a boolean (true/false).",
    });
  });

  test("POST /swift-codes should return 400 for invalid SWIFT code length", async () => {
    const invalidData = { ...validSwiftCodeData, swiftCode: "SHORT" };

    const response = await request(app).post("/swift-codes").send(invalidData);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Invalid SWIFT code length. For headquarter it must be 8 characters. ",
    });
  });

  test("POST /swift-codes should insert a valid SWIFT code", async () => {
    const response = await request(app).post("/swift-codes").send(validSwiftCodeData);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ message: "SWIFT code entry added successfully" });

    const checkResult = await executeQuery(client, "SELECT * FROM swift_data WHERE swift_code = $1", [
      validSwiftCodeData.swiftCode + "XXX",
    ]);

    expect(checkResult.length).toBe(1);
  });

  test("POST /swift-codes should return 409 if SWIFT code already exists", async () => {
    await executeInsertQuery(client, "INSERT INTO swift_data (swift_code) VALUES ($1)", [
      validSwiftCodeData.swiftCode + "XXX",
    ]);

    const response = await request(app).post("/swift-codes").send(validSwiftCodeData);

    expect(response.status).toBe(409);
    expect(response.body).toEqual({ message: "SWIFT code already exists" });
  });

  test("Database connection should not be closed before tests finish", async () => {
    expect(client).toBeDefined();
    expect(client.release).toBeDefined();
  });
});
