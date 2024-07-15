import express, { Router } from "express";
import authMiddleware, { Role } from "../middleware/authMiddleware";
import categoryController from "../controllers/categoryController";

const router: Router = express.Router();

router
  .route("/")
  .get(categoryController.getCategories)
  .post(
    authMiddleware.isAuthenticated,
    authMiddleware.restrictTo(Role.Admin),
    categoryController.addCategory
  );

router
  .route("/:id")
  .delete(
    authMiddleware.isAuthenticated,
    authMiddleware.restrictTo(Role.Admin),
    categoryController.deleteCategory
  )
  .patch(
    authMiddleware.isAuthenticated,
    authMiddleware.restrictTo(Role.Admin),
    categoryController.updateCategory
  );
export default router;
