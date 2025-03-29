import request from "supertest";
import express from "express";
import put_swift_code_router from "../src/routers/put_swift_code_router";
import { connectToDb, executeInsertQuery, executeQuery } from "../src/db/db";

jest.mock("../src/db/db", () => ({
  connectToDb: jest.fn(),
  executeInsertQuery: jest.fn(),
  executeQuery: jest.fn(),
}));

describe("POST /swift-codes", () => {
  let app: express.Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use(put_swift_code_router);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 201 if SWIFT code is added successfully", async () => {
    const mockConn = { release: jest.fn() };

    (connectToDb as jest.Mock).mockResolvedValue(mockConn);
    (executeQuery as jest.Mock).mockResolvedValue([]);
    (executeInsertQuery as jest.Mock).mockResolvedValue({});

    const response = await request(app).post("/swift-codes").send({
      address: "123 Bank St",
      bankName: "Test Bank",
      countryISO2: "US",
      countryName: "United States",
      isHeadquarter: false,
      swiftCode: "TESTUS33XXX",
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: "SWIFT code entry added successfully",
    });

    expect(connectToDb).toHaveBeenCalledTimes(1);
    expect(executeQuery).toHaveBeenCalledTimes(1);
    expect(executeInsertQuery).toHaveBeenCalledTimes(1);
    expect(mockConn.release).toHaveBeenCalledTimes(1);
  });

  it("should return 409 if SWIFT code already exists", async () => {
    const mockConn = { release: jest.fn() };

    (connectToDb as jest.Mock).mockResolvedValue(mockConn);
    (executeQuery as jest.Mock).mockResolvedValue([
      { swiftCode: "TESTUS33XXX" },
    ]);

    const response = await request(app).post("/swift-codes").send({
      address: "123 Bank St",
      bankName: "Test Bank",
      countryISO2: "US",
      countryName: "United States",
      isHeadquarter: false,
      swiftCode: "TESTUS33XXX",
    });

    expect(response.status).toBe(409);
    expect(response.body).toEqual({ message: "SWIFT code already exists" });

    expect(connectToDb).toHaveBeenCalledTimes(1);
    expect(executeQuery).toHaveBeenCalledTimes(1);
    expect(executeInsertQuery).not.toHaveBeenCalled();
    expect(mockConn.release).toHaveBeenCalledTimes(1);
  });

  it("should return 400 if required fields are missing", async () => {
    const response = await request(app).post("/swift-codes").send({
      address: "123 Bank St",
      bankName: "Test Bank",
      countryISO2: "US",
      countryName: "United States",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Missing required fields" });

    expect(connectToDb).not.toHaveBeenCalled();
    expect(executeQuery).not.toHaveBeenCalled();
    expect(executeInsertQuery).not.toHaveBeenCalled();
  });

  it("should return 400 if countryISO2 is not exactly 2 characters", async () => {
    const response = await request(app).post("/swift-codes").send({
      address: "123 Bank St",
      bankName: "Test Bank",
      countryISO2: "USA",
      countryName: "United States",
      isHeadquarter: false,
      swiftCode: "TESTUS33XXX",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Invalid country ISO2 code. It must be exactly 2 characters.",
    });
  });

  it("should return 400 if isHeadquarter is not a boolean", async () => {
    const response = await request(app).post("/swift-codes").send({
      address: "123 Bank St",
      bankName: "Test Bank",
      countryISO2: "US",
      countryName: "United States",
      isHeadquarter: "yes",
      swiftCode: "TESTUS33XXX",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message:
        "Invalid isHeadquarter value. It must be a boolean (true/false).",
    });
  });

  it("should return 400 if SWIFT code is 8 characters but not a headquarters", async () => {
    const response = await request(app).post("/swift-codes").send({
      address: "123 Bank St",
      bankName: "Test Bank",
      countryISO2: "US",
      countryName: "United States",
      isHeadquarter: false,
      swiftCode: "TESTUS33",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Invalid SWIFT code length. It must be 11 characters.",
    });
  });

  it("should return 400 if SWIFT code is 11 characters but is a headquarters", async () => {
    const response = await request(app).post("/swift-codes").send({
      address: "123 Bank St",
      bankName: "Test Bank",
      countryISO2: "US",
      countryName: "United States",
      isHeadquarter: true,
      swiftCode: "TESTUS33XXX",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message:
        "Invalid SWIFT code length. For headquarter it must be 8 characters. ",
    });
  });

  it("should return 500 if DB connection fails", async () => {
    (connectToDb as jest.Mock).mockRejectedValue(
      new Error("DB connection error"),
    );

    const response = await request(app).post("/swift-codes").send({
      address: "123 Bank St",
      bankName: "Test Bank",
      countryISO2: "US",
      countryName: "United States",
      isHeadquarter: false,
      swiftCode: "TESTUS33XXX",
    });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: "Internal Server Error" });

    expect(connectToDb).toHaveBeenCalledTimes(1);
    expect(executeQuery).not.toHaveBeenCalled();
    expect(executeInsertQuery).not.toHaveBeenCalled();
  });

  it("should return 500 if query execution fails", async () => {
    const mockConn = { release: jest.fn() };

    (connectToDb as jest.Mock).mockResolvedValue(mockConn);
    (executeQuery as jest.Mock).mockResolvedValue([]);
    (executeInsertQuery as jest.Mock).mockRejectedValue(
      new Error("Query execution error"),
    );

    const response = await request(app).post("/swift-codes").send({
      address: "123 Bank St",
      bankName: "Test Bank",
      countryISO2: "US",
      countryName: "United States",
      isHeadquarter: false,
      swiftCode: "TESTUS33XXX",
    });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: "Internal Server Error" });

    expect(connectToDb).toHaveBeenCalledTimes(1);
    expect(executeQuery).toHaveBeenCalledTimes(1);
    expect(executeInsertQuery).toHaveBeenCalledTimes(1);
    expect(mockConn.release).toHaveBeenCalledTimes(1);
  });
});
