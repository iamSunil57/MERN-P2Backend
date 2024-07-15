import { Request, Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import Cart from "../database/models/Cart";
import Product from "../database/models/Product";

class CartController {
  async addTOCart(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    const { quantity, productId } = req.body;
    if (!quantity || !productId) {
      res.status(400).json({
        message: "Please provide quantity, productId",
      });
    }

    //Check if product already exist in the cart
    let cartItem = await Cart.findOne({
      where: {
        productId,
        userId,
      },
    });
    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      //Insert to cart table
      cartItem = await Cart.create({
        quantity,
        userId,
        productId,
      });
    }
    res.status(200).json({
      message: "Product added to cart",
      data: cartItem,
    });
  }

  async getMyCart(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    const cartItems = await Cart.findAll({
      where: {
        userId,
      },
      include: [
        {
          model: Product,
        },
      ],
    });
    if (cartItems.length === 0) {
      res.status(400).json({
        message: "No items in cart",
      });
    } else {
      res.status(200).json({
        message: "Cart items fetched successfully",
        data: cartItems,
      });
    }
  }
}

export default new CartController();
