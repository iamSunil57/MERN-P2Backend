import express, { Router } from "express";
import authMiddleware from "../middleware/authMiddleware";
import cartController from "../controllers/cartController";
const router: Router = express.Router();

router
  .route("/")
  .get(authMiddleware.isAuthenticated, cartController.getMyCarts)
  .post(authMiddleware.isAuthenticated, cartController.addTOCart);

router
  .route("/:productId")
  .patch(authMiddleware.isAuthenticated, cartController.updateCartItem)
  .delete(authMiddleware.isAuthenticated, cartController.deleteMyCartItem);
export default router;
