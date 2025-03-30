import express from "express";
import Config from "./config/Config";
import cors from "cors";
import router_endpoints from "./routes/ApiRoutesEndpoints";

const app = express();
const PORT = Config.app_port;

app.use(cors());
app.use(express.json());
app.use(router_endpoints);

const ApiApp = express();
ApiApp.use(app);

ApiApp.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
