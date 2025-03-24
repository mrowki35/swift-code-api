import express from "express";
import swift_codes_router from "../routers/swift_codes_router";
const router_endpoints = express.Router();
const API_ROOT: string = "/v1";;

router_endpoints.use(API_ROOT,swift_codes_router);
export default router_endpoints;
