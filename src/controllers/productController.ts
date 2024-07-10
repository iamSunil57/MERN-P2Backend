import { Request, Response } from "express";
import Product from "../database/models/Product";

class productController {
  public static async addProduct(req: Request, res: Response): Promise<void> {
    const { productName, description, price } = req.body;
    if (!productName || !price) {
      res.status(400).json({
        message: "Please provide productName and price",
      });
      return;
    }

    // Additional validation for price (assuming it should be a number)
    if (isNaN(Number(price))) {
      res.status(400).json({
        message: "Price should be a valid number.",
      });
      return;
    }

    await Product.create({
      productName,
      description,
      price: Number(price), //convert price to number if needed
    });

    res.status(200).json({
      message: "Product Added successfully",
    });
  }
}
export default productController;
