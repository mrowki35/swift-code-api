import express from "express";
const router_endpoints = express.Router();
const API_ROOT: string = "/v1";;

router_endpoints.use(API_ROOT);
export default router_endpoints;
