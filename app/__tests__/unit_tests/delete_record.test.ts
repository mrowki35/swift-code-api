import request from "supertest";
import express from "express";
import delete_record_router from "../../src/routers/DeleteRecordRouter";
import db, { connectToDb, executeDeleteQuery, closeDbPool } from "../../src/db/db";

jest.mock("../../src/db/db", () => ({
  connectToDb: jest.fn(),
  executeDeleteQuery: jest.fn(),
  closeDbPool: jest.fn(),
}));

describe("DELETE /swift-codes/:swiftCode", () => {
  let app: express.Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use(delete_record_router);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await closeDbPool();
  });

  it("should return 400 if SWIFT code is missing", async () => {
    const response = await request(app).delete("/swift-codes/");

    expect(response.status).toBe(400);
  });

  it("should return 500 if DB connection fails", async () => {
    (connectToDb as jest.Mock).mockRejectedValue(
      new Error("DB connection error"),
    );

    const response = await request(app).delete("/swift-codes/TEST123");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: "Internal Server Error" });

    expect(connectToDb).toHaveBeenCalledTimes(1);
    expect(executeDeleteQuery).not.toHaveBeenCalled();
  });

  it("should return 500 if query execution fails", async () => {
    const mockConn = { release: jest.fn() };

    (connectToDb as jest.Mock).mockResolvedValue(mockConn);
    (executeDeleteQuery as jest.Mock).mockRejectedValue(
      new Error("Query execution error"),
    );

    const response = await request(app).delete("/swift-codes/TEST123");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: "Internal Server Error" });

    expect(connectToDb).toHaveBeenCalledTimes(1);
    expect(executeDeleteQuery).toHaveBeenCalledTimes(1);
    expect(mockConn.release).toHaveBeenCalledTimes(1);
  });

  it("should return 404 if SWIFT code is not found", async () => {
    const mockConn = { release: jest.fn() };

    (connectToDb as jest.Mock).mockResolvedValue(mockConn);
    (executeDeleteQuery as jest.Mock).mockResolvedValue({ rowCount: 0 });

    const response = await request(app).delete("/swift-codes/NOTFOUND");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "SWIFT code not found" });

    expect(connectToDb).toHaveBeenCalledTimes(1);
    expect(executeDeleteQuery).toHaveBeenCalledTimes(1);
    expect(mockConn.release).toHaveBeenCalledTimes(1);
  });

  it("should return 200 if SWIFT code is deleted successfully", async () => {
    const mockConn = { release: jest.fn() };

    (connectToDb as jest.Mock).mockResolvedValue(mockConn);
    (executeDeleteQuery as jest.Mock).mockResolvedValue({ rowCount: 1 });

    const response = await request(app).delete("/swift-codes/VALID123");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "SWIFT code deleted successfully",
    });

    expect(connectToDb).toHaveBeenCalledTimes(1);
    expect(executeDeleteQuery).toHaveBeenCalledTimes(1);
    expect(mockConn.release).toHaveBeenCalledTimes(1);
  });
});
