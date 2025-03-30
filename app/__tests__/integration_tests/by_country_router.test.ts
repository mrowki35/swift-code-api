import request from "supertest";
import express from "express";
import banks_by_country_router from "../../src/routers/BanksByCountryRouter";
import { connectToDb, closeDbPool } from "../../src/db/db";
import { PoolClient } from "pg";



describe("Banks By Country API Integration Tests", () => {


    const app = express();
    app.use(express.json());
    app.use("/", banks_by_country_router);
    

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



  test("GET /swift-codes/country/ should return 400 if no country ISO2 code is provided", async () => {
    const response = await request(app).get("/swift-codes/country/");
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Missing country ISO2 code parameter.",
    });
  });

 test("GET /swift-codes/country/:countryISO2code should return real database data", async () => {
    const response = await request(app).get("/swift-codes/country/PL");

    expect(response.status).toBe(200);
    expect(response.body.swiftCodes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          countryISO2: "PL",
          bankName: "PKO TOWARZYSTWO FUNDUSZY INWESTYCYJNYCH SA",
        }),
      ]),
    );
  });
  
});
