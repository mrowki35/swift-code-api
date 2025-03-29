import express, { Request, Response, Router } from "express";
import { connectToDb, executeDeleteQuery } from "../db/db";
import { delete_swift_code_query } from "../db/queries";

const delete_record_router: Router = express.Router();

delete_record_router.delete(
  "/swift-codes/:swiftCode",
  async (req: Request, res: Response): Promise<void> => {
    const swiftCode = req.params.swiftCode;

    if (!swiftCode) {
      res.status(400).json({ message: "SWIFT code is required" });
      return;
    }

    let conn: any = null;

    try {
      conn = await connectToDb();

      const result = await executeDeleteQuery(conn, delete_swift_code_query, [
        swiftCode,
      ]);

      if (result.rowCount === 0) {
        res.status(404).json({ message: "SWIFT code not found" });
        return;
      }

      res.status(200).json({ message: "SWIFT code deleted successfully" });
    } catch (error) {
      console.error("Error deleting SWIFT code:", error);
      res.status(500).json({ message: "Internal Server Error" });
    } finally {
      if (conn) {
        conn.release();
        console.debug(`DB connection released back to pool`);
      }
    }
  },
);

export default delete_record_router;
