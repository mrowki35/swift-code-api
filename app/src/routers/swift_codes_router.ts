import express, { Request, Response, Router } from "express";
import { connectToDb, executeQuery } from "../db/db";
import { swift_codes_query } from "../db/queries";

const swift_code_router: Router = express.Router();

swift_code_router.get(
    "/swift-codes/:swiftCode",
    async (req: Request, res: Response): Promise<void> => {
      const swiftCode = req.params.swiftCode;
  
      try {
        const result = await executeQuery(connectToDb(),  swift_codes_query , [swiftCode]); 
  
        if (result.length === 0) {
          res.status(404).json({ message: "Swift code not found" });
          return;
        }
  
        res.json(result[0]);
      } catch (error) {
        console.error("Error fetching SWIFT code:", error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  );
  

export default swift_code_router;
