import { Pool, PoolClient } from "pg";
import { executeQuery } from "../src/db/db";

jest.mock("pg", () => {
    const mockQuery = jest.fn();
    const mockClient = {
        query: mockQuery,
        release: jest.fn(),
    };

    const mockPool = {
        connect: jest.fn().mockResolvedValue(mockClient),
        end: jest.fn(),
        on: jest.fn(),
    };

    return { Pool: jest.fn(() => mockPool) }; 
});

describe("executeQuery", () => {
    let mockClient: PoolClient;
    let mockPool: jest.Mocked<Pool>;

    beforeEach(async () => {
        mockPool = new (jest.requireMock("pg").Pool)(); 
        mockClient = await mockPool.connect(); 
        jest.clearAllMocks();
    });

    it("should handle query errors", async () => {
        const sql = "SELECT 1";
        const params: any[] = [];
        const errorMessage = "Query failed";

        (mockClient.query as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

        await expect(executeQuery(await Promise.resolve(mockClient), sql, params)).rejects.toThrow(errorMessage);
        expect(mockClient.query).toHaveBeenCalledWith(sql, params);
    });


    it("should execute query successfully", async () => {
        const sql = "SELECT * FROM users";
        const params: any[] = [];
        const mockResult = [{ id: 1, name: "John Doe" }]; 


        (mockClient.query as jest.Mock).mockResolvedValueOnce({ rows: mockResult });
        
        const result = await executeQuery(await Promise.resolve(mockClient), sql, params);

        expect(result).toEqual(mockResult); 
        expect(mockClient.query).toHaveBeenCalledWith(sql, params); 
});
});
