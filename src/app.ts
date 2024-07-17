import express, { Application, Request, Response } from "express";

const app: Application = express();
const PORT: number = 3000;

// require("./model/index");
import * as dotenv from "dotenv";
dotenv.config();

import "./database/connection";

import adminSeeder from "./adminSeeder";
import userRoute from "./routes/userRoute";
import productRoute from "./routes/productRoute";
import categoryRoute from "./routes/categoryRoute";
import categoryController from "./controllers/categoryController";
import cartRoute from "./routes/cartRoute";
import orderRoute from "./routes/orderRoute";
app.use(express.json());

//Admin Seeder:
adminSeeder();

//localhost:3000/register || localhost:3000/x/register
app.use("", userRoute);
app.use("/admin/product", productRoute);
app.use("/admin/category", categoryRoute);
app.use("/customer/cart", cartRoute);
app.use("/customer/order", orderRoute);

app.listen(PORT, () => {
  categoryController.seedCategory();
  console.log("Server has started at port:", PORT);
});
