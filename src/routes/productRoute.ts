import express, { Router } from "express";
import productController from "../controllers/productController";
const router: Router = express.Router();

// Endpoint for creating a new product

router.route("/product").post(productController.addProduct);
export default router;
