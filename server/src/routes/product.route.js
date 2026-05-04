import express from "express";
import { createProduct, getProducts, getAllProducts, deleteProduct, updateProduct } from "../controllers/product.controller.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/", upload.single("image"), createProduct);

router.get("/", getProducts);

router.get("/all", getAllProducts);

router.delete("/:id", deleteProduct);

router.put("/:id", upload.single("image"), updateProduct);

export default router;