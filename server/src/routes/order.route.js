import express from "express";

import { createOrder, getOrders, updateOrderStatus } from "../controllers/order.controller.js";

const router = express.Router();

router.patch('/:id/status', updateOrderStatus);

router.post("/", createOrder);

router.get("/", getOrders);



export default router;
