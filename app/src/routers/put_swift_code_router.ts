import express, { Request, Response, Router } from "express";
import { connectToDb, executeInsertQuery, executeQuery } from "../db/db";
import { insert_swift_code_query, swift_codes_query } from "../db/queries";

const put_swift_code_router: Router = express.Router();

put_swift_code_router.post(
  "/swift-codes",
  async (req: Request, res: Response): Promise<void> => {
    let {
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

    if (countryISO2.length !== 2) {
      res
        .status(400)
        .json({
          message:
            "Invalid country ISO2 code. It must be exactly 2 characters.",
        });
      return;
    }

    if (typeof isHeadquarter !== "boolean") {
      res
        .status(400)
        .json({
          message:
            "Invalid isHeadquarter value. It must be a boolean (true/false).",
        });
      return;
    }

    if (swiftCode.length !== 8 && isHeadquarter) {
      res
        .status(400)
        .json({
          message:
            "Invalid SWIFT code length. For headquarter it must be 8 characters. ",
        });
      return;
    } else if (swiftCode.length !== 11 && !isHeadquarter) {
      res
        .status(400)
        .json({
          message: "Invalid SWIFT code length. It must be 11 characters.",
        });
      return;
    }

    if (swiftCode.length === 8 && isHeadquarter) {
      swiftCode = `${swiftCode}XXX`;
    }

    let conn: any = null;

    try {
      conn = await connectToDb();
      const result = await executeQuery(conn, swift_codes_query, [swiftCode]);

      if (result[0]) {
        res.status(409).json({ message: "SWIFT code already exists" });
        return;
      }

      await executeInsertQuery(conn, insert_swift_code_query, [
        countryISO2,
        swiftCode,
        bankName,
        address,
        countryName,
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
