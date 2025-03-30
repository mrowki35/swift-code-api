import express, { Request, Response, Router } from "express";
import { connectToDb, executeQuery } from "../db/db";
import { banks_by_country_query, country_name_query } from "../db/queries";
import { isEmptyIdResponsePredicate } from "../validators/Predicate";
import { handleResponse } from "../responses/ResponseHandler";
import { BanksByCountryResponse } from "../responses/BanksByCountryResponse";

const banks_by_country_router: Router = express.Router();


banks_by_country_router.get(
  "/swift-codes/country/",
  (req: Request, res: Response): void => {
     res.status(400).json({ error: "Missing country ISO2 code parameter." });
     return;
  }
);

banks_by_country_router.get(
  "/swift-codes/country/:countryISO2code",
  async (req: Request, res: Response): Promise<void> => {
    const countryISO2code = req.params.countryISO2code;
    let conn: any = null;

    if (!countryISO2code) {
      res.status(400).json({ error: "Country ISO2 code is required" });
      return;
    }

    try {
      conn = await connectToDb();
      const hedquarters = await executeQuery(conn, banks_by_country_query, [
        countryISO2code,
      ]);
      const countryName = await executeQuery(conn, country_name_query, [
        countryISO2code,
      ]);

      handleResponse(
        res,
        req.path,
        new BanksByCountryResponse(
          countryISO2code,
          countryName[0]?.["countryname"],
          hedquarters,
        ),
        isEmptyIdResponsePredicate(countryName[0]),
      );
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
      console.debug(error);
    } finally {
      if (conn) {
        conn.release();
        console.debug(`DB connection released back to pool`);
      }
    }
  },
);

export default banks_by_country_router;
