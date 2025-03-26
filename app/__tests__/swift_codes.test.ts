import request from "supertest";
import express from "express";
import { connectToDb, executeQuery } from "../src/db/db";
import banks_by_country_router from "../src/routers/banks_by_country_router";
jest.mock("../src/db/db", () => ({
  connectToDb: jest.fn(),
  executeQuery: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use(banks_by_country_router);

describe("GET /swift-codes/country/:countryISO2code", () => {
  let mockConnect: jest.Mock;
  let mockExecuteQuery: jest.Mock;

  beforeEach(() => {
    mockConnect = connectToDb as jest.Mock;
    mockExecuteQuery = executeQuery as jest.Mock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return banks for a given country", async () => {
    const countryISO2code = "CL";

    const mockDbConnection = { release: jest.fn() };
    mockConnect.mockResolvedValue(mockDbConnection);

    mockExecuteQuery
      .mockResolvedValueOnce([{ countryname: "CHILE" }])
      .mockResolvedValueOnce([
        {
          address: "  ",
          bankname: "BCI CORREDOR DE BOLSA S.A.",
          countryiso2: "CL",
          isheadquarter: 1,
          swift_code: "BCCSCLR1XXX",
        },
      ]);

    const response = await request(app).get(`/swift-codes/country/CL`);

    console.log("Test Response:", response.body);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      countryISO2: "CL",
      countryName: "CHILE",
      swiftCodes: [
        {
          address: "  ",
          bankname: "BCI CORREDOR DE BOLSA S.A.",
          countryiso2: "CL",
          isheadquarter: 1,
          swift_code: "BCCSCLR1XXX",
        },
      ],
    });
  });
});
