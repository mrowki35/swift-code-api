import express, { Request, Response, Router } from "express";
import { connectToDb, executeQuery } from "../db/db";
import { branches_swift_codes_query, swift_codes_query } from "../db/queries";
import { isEmptyIdResponsePredicate } from "../validators/Predicate";
import { handleResponse } from "../responses/ResponseHandler";
import { HeadquarterResponse } from "../responses/HeadquarterResponse";
import { BranchResponse } from "../responses/BranchResponse";

const swift_code_router: Router = express.Router();

swift_code_router.get(
  "/swift-codes/:swiftCode",
  async (req: Request, res: Response): Promise<void> => {
    const swiftCode = req.params.swiftCode;
    let conn: any = null;

    try {
      conn = await connectToDb();
      const result = await executeQuery(conn, swift_codes_query, [swiftCode]);

      const swiftCodeData = result[0];
      if (swiftCodeData?.["isheadquarter"] == 1) {
        const branches = await executeQuery(conn, branches_swift_codes_query, [
          swiftCode,
        ]);
        handleResponse(
          res,
          req.path,
          new HeadquarterResponse(
            swiftCodeData?.["address"],
            swiftCodeData?.["bank_name"],
            swiftCodeData?.["countryiso2"],
            swiftCodeData?.["countryname"],
            swiftCodeData?.["isheadquarter"],
            swiftCodeData?.["swift_code"],
            branches,
          ),
          isEmptyIdResponsePredicate(result[0]),
        );
      } else {
        handleResponse(
          res,
          req.path,
          new BranchResponse(
            swiftCodeData?.["address"],
            swiftCodeData?.["bank_name"],
            swiftCodeData?.["countryiso2"],
            swiftCodeData?.["countryname"],
            swiftCodeData?.["isheadquarter"],
            swiftCodeData?.["swift_code"],
          ),
          isEmptyIdResponsePredicate(result[0]),
        );
      }
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

export default swift_code_router;
