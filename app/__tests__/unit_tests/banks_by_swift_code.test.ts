import request from "supertest";
import express from "express";
import swift_code_router from "../../src/routers/GetBySwiftCodeRouter";
import db, { connectToDb, executeQuery, closeDbPool } from "../../src/db/db";


jest.mock("../../src/db/db", () => ({
  connectToDb: jest.fn(),
  executeQuery: jest.fn(),
  closeDbPool: jest.fn(),
}));

jest.mock("../../src/responses/ResponseHandler", () => ({
  handleResponse: jest.fn(),
}));

describe("Test Swift Code Router", () => {
  let app: express.Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use(swift_code_router);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await closeDbPool();
  });

  describe("GET /swift-codes/", () => {
    it("should return 400 if no swiftCode parameter is provided", async () => {
      const response = await request(app).get("/swift-codes/");
      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Missing swiftCode parameter.");
    });
  });


    it("should return 500 if DB connection fails", async () => {
      (connectToDb as jest.Mock).mockRejectedValue(
        new Error("DB connection error"),
      );

      const response = await request(app).get("/swift-codes/123456");

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: "Internal Server Error" });

      expect(connectToDb).toHaveBeenCalledTimes(1);
      expect(executeQuery).not.toHaveBeenCalled();
    });

    it("should return 500 if query execution fails", async () => {
      const mockConn = { release: jest.fn() };

      (connectToDb as jest.Mock).mockResolvedValue(mockConn);
      (executeQuery as jest.Mock).mockRejectedValue(
        new Error("Query execution error"),
      );

      const response = await request(app).get("/swift-codes/123456");

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: "Internal Server Error" });

      expect(connectToDb).toHaveBeenCalledTimes(1);
      expect(executeQuery).toHaveBeenCalledTimes(1);
      expect(mockConn.release).toHaveBeenCalledTimes(1);
    });

   
});
