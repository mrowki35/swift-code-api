import express, { Request, Response, Router } from "express";
import { connectToDb, executeQuery } from "../db/db";
import { swift_codes_query } from "../db/queries";

const swift_code_router: Router = express.Router();

swift_code_router.get(
    "/swift-codes/:swiftCode",
    async (req: Request, res: Response): Promise<void> => {
      const swiftCode = req.params.swiftCode;
        let conn: any = null;
  
      try {
        conn = await connectToDb();
        const result = await executeQuery(conn,  swift_codes_query , [swiftCode]); 
        //const branches = await 
     
  
        res.json(result[0]);
      } catch (error) {
        res.status(500).json({ error: "Failed to connect to DB"});
      } 
    
  }
  );

  

export default swift_code_router;
