import express, { Request, Response, Router } from "express";
import { connectToDb, executeQuery } from "../db/db";
import { insert_swift_code_query } from "../db/queries";
import { handleResponse } from "../responses/ResponseHandler";

const put_swift_code_router: Router = express.Router();

put_swift_code_router.post(
  "/v1/swift-codes",
  async (req: Request, res: Response): Promise<void> => {
    const {
      address,
      bankName,
      countryISO2,
      countryName,
      isHeadquarter,
      swiftCode,
    } = req.body;

    if (
      !address ||
      !bankName ||
      !countryISO2 ||
      !countryName ||
      isHeadquarter === undefined ||
      !swiftCode
    ) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    let conn: any = null;

    try {
      conn = await connectToDb();

      await executeQuery(conn, insert_swift_code_query, [
        swiftCode,
        bankName,
        address,
        countryISO2,
        countryName,
        isHeadquarter,
      ]);

      res.status(201).json({ message: "SWIFT code entry added successfully" });
    } catch (error) {
      console.error("Error adding SWIFT code:", error);
      res.status(500).json({ message: "Internal Server Error" });
    } finally {
      if (conn) {
        conn.release();
        console.debug(`DB connection released back to pool`);
      }
    }
  },
);

export default put_swift_code_router;
