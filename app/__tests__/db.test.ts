import { Pool, PoolClient } from "pg";
import { connectToDb, closeDbPool } from "../src/db/db";

jest.mock("pg", () => {
  const mockClient = {
    query: jest.fn(),
    release: jest.fn(),
  };
  const mockPool = {
    connect: jest.fn().mockResolvedValue(mockClient),
    end: jest.fn(),
    on: jest.fn(),
  };
  return { Pool: jest.fn(() => mockPool) };
});

describe("Database Connection", () => {
  let mockPool: Pool;
  let mockClient: PoolClient;

  beforeEach(async () => {
    mockPool = new Pool() as any;
    mockClient = await mockPool.connect();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should establish a connection to the database", async () => {
    const client = await connectToDb();
    expect(mockPool.connect).toHaveBeenCalledTimes(1);
    expect(client).toBe(mockClient);
  });

  it("should handle database connection errors", async () => {
    (mockPool.connect as jest.Mock).mockRejectedValueOnce(
      new Error("Connection failed"),
    );

    await expect(connectToDb()).rejects.toThrow("Connection failed");
    expect(mockPool.connect).toHaveBeenCalledTimes(1);
  });

  it("should close the connection pool", async () => {
    await closeDbPool();
    expect(mockPool.end).toHaveBeenCalledTimes(1);
  });
});
