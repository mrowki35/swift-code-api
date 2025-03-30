import request from "supertest";
import express from "express";
import banks_by_country_router from "../src/routers/BanksByCountryRouter";
import db, { connectToDb, executeQuery, closeDbPool } from "../src/db/db";

jest.mock("../src/db/db", () => ({
  connectToDb: jest.fn(),
  executeQuery: jest.fn(),
  closeDbPool: jest.fn(),
}));

jest.mock("../src/responses/ResponseHandler", () => ({
  handleResponse: jest.fn(),
}));

jest.mock("../src/validators/Predicate", () => ({
  isEmptyIdResponsePredicate: jest.fn(),
}));

describe("GET /swift-codes/country/:countryISO2code", () => {
  let app: express.Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use(banks_by_country_router);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await closeDbPool();
  });

  it("should return 400 if iso coubtry code is missing", async () => {
      const response = await request(app).get("/swift-codes/country/");
  
      expect(response.status).toBe(400);
  });
  

  it("should return a 500 error if DB connection fails", async () => {
    (connectToDb as jest.Mock).mockRejectedValue(
      new Error("DB connection error"),
    );

    const response = await request(app).get("/swift-codes/country/US");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: "Internal Server Error" });

    expect(connectToDb).toHaveBeenCalledTimes(1);
    expect(executeQuery).not.toHaveBeenCalled();
  });

  it("should return a 500 error if query execution fails", async () => {
    const mockConn = { release: jest.fn() };

    (connectToDb as jest.Mock).mockResolvedValue(mockConn);
    (executeQuery as jest.Mock).mockRejectedValue(
      new Error("Query execution error"),
    );

    const response = await request(app).get("/swift-codes/country/US");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: "Internal Server Error" });

    expect(connectToDb).toHaveBeenCalledTimes(1);
    expect(executeQuery).toHaveBeenCalledTimes(1);
    expect(mockConn.release).toHaveBeenCalledTimes(1);
  });
});
