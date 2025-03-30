import express from "express";
import swift_codes_router from "../routers/GetBySwiftCodeRouter";
import put_swift_code_router from "../routers/PostSwiftCodeRouter";
import banks_by_country_router from "../routers/BanksByCountryRouter";
import delete_record_router from "../routers/DeleteRecordRouter";
const router_endpoints = express.Router();
const API_ROOT: string = "/v1";

router_endpoints.use(API_ROOT, banks_by_country_router);
router_endpoints.use(API_ROOT, swift_codes_router);
router_endpoints.use(API_ROOT, delete_record_router);
router_endpoints.use(API_ROOT, put_swift_code_router);
export default router_endpoints;
