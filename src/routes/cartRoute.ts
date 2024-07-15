import express, { Router } from "express";
import authMiddleware from "../middleware/authMiddleware";
import cartController from "../controllers/cartController";
const router: Router = express.Router();

router
  .route("/")
  .get(authMiddleware.isAuthenticated, cartController.getMyCart)
  .post(authMiddleware.isAuthenticated, cartController.addTOCart);
export default router;
