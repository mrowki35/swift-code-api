import express from "express";

import cors from "cors";
import router_endpoints from "./routes/ApiRoutesEndpoints";

/*
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(router_endpoints);

const ApiApp = express();
ApiApp.use( app);

ApiApp.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
*/
import { connectToDb } from './db/db';

export const getAllRecords = async (): Promise<any[]> => {
  const client = await connectToDb(); 
  try {
    const res = await client.query('SELECT * FROM swift_data');
    return res.rows; 
  } catch (err) {
    console.error("Error fetching records:", err);
    throw err;
  } finally {
    client.release();
  }
};

async function main() {
    try {
      const records = await getAllRecords();
      console.log("Fetched records:", records);
    } catch (err) {
      console.error("Error in main:", err);
    }
  }
  
  main(); 
