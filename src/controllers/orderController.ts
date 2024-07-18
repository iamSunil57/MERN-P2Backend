import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import {
  KhaltiResponse,
  OrderData,
  PaymentMethod,
  TransactionStatus,
  TransactionVerificationResponse,
} from "../types/orderTypes";
import Order from "../database/models/Order";
import Payment from "../database/models/Payment";
import OrderDetails from "../database/models/OrderDetail";
import axios from "axios";
import { Model } from "sequelize";

class OrderController {
  async createOrder(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    const {
      phoneNumber,
      shippingAddress,
      totalAmount,
      paymentDetails,
      items,
    }: OrderData = req.body;

    if (
      !phoneNumber ||
      !shippingAddress ||
      !totalAmount ||
      !paymentDetails ||
      !paymentDetails.paymentMethod ||
      items.length == 0
    ) {
      res.status(400).json({
        message:
          "Please provide phoneNumber,shippingAddress,totalAmount,paymentDetails,items",
      });
      return;
    }

    const paymentData = await Payment.create({
      paymentMethod: paymentDetails.paymentMethod,
    });

    const orderData = await Order.create({
      phoneNumber,
      shippingAddress,
      totalAmount,
      userId,
      paymentId: paymentData.id,
    });
    let responseOrderData;

    for (var i = 0; i < items.length; i++) {
      responseOrderData = await OrderDetails.create({
        quantity: items[i].quantity,
        productId: items[i].productId,
        orderId: orderData.id,
      });
    }

    if (paymentDetails.paymentMethod.toLowerCase() === PaymentMethod.KHALTI) {
      //Khalti Integration
      const data = {
        return_url: "http://localhost:3000/success/",
        purchase_order_id: orderData.id,
        amount: totalAmount * 100, // 'paisa' ma hunxa so * 100
        website_url: "http://localhost:3000/",
        purchase_order_name: "orderName_" + orderData.id,
      };
      const response = await axios.post(
        "https://a.khalti.com/api/v2/epayment/initiate/",
        data,
        {
          headers: {
            Authorization: "key " + process.env.KHALTI_KEY,
          },
        }
      );
      const khaltiResponse: KhaltiResponse = response.data;
      paymentData.pidx = khaltiResponse.pidx;
      paymentData.save();
      res.status(200).json({
        message: "Order placed successfully",
        url: khaltiResponse.payment_url,
      });
    } else {
      console.log("I am inside else statement");
      res.status(200).json({
        message: "Order placed successfully.",
      });
    }
  }

  async verifyTransaction(req: AuthRequest, res: Response): Promise<void> {
    const { pidx } = req.body;
    if (!pidx) {
      res.status(400).json({
        message: "Please provide pidx",
      });
      return;
    }
    const response = await axios.post(
      "https://a.khalti.com/api/v2/epayment/lookup/",
      { pidx },
      {
        headers: {
          Authorization: "key " + process.env.KHALTI_KEY,
        },
      }
    );
    const data: TransactionVerificationResponse = response.data;
    console.log(data);
    if (data.status === TransactionStatus.COMPLETED) {
      await Payment.update(
        { paymentStatus: "paid" },
        {
          where: {
            pidx: pidx,
          },
        }
      );
      res.status(200).json({
        message: "Paymnet verified successfully",
      });
    } else {
      res.status(200).json({
        message: "Payment not verified",
      });
    }
  }
}
export default new OrderController();
