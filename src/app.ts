import express, { Application, Request, Response } from "express";

const app: Application = express();
const PORT: number = 4000;

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
import cors from "cors";
app.use(express.json());

//Admin Seeder:
adminSeeder();

//Image Check:
app.use(express.static("./src/uploads"));

//Cors to allow all protocols to access the database and backend
app.use(
  cors({
    origin: "*",
  })
);

//localhost:3000/register || localhost:3000/x/register
app.use("", userRoute);
app.use("/admin/product", productRoute);
app.use("/admin/category", categoryRoute);
app.use("/customer/cart", cartRoute);
app.use("/order", orderRoute);
app.use("/customer/order", orderRoute);
// app.use("/admin/order", orderRoute);

app.listen(PORT, () => {
  categoryController.seedCategory();
  console.log("Server has started at port:", PORT);
});
