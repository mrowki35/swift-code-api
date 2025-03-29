import express from "express";
import swift_codes_router from "../routers/swift_codes_router";
import banks_by_country_router from "../routers/swift_code_country_router";
import put_swift_code_router from "../routers/put_swift_code_router";

const router_endpoints = express.Router();
const API_ROOT: string = "/v1";;

router_endpoints.use(API_ROOT,swift_codes_router);
router_endpoints.use(API_ROOT,banks_by_country_router);
router_endpoints.use(API_ROOT,put_swift_code_router);

export default router_endpoints;
