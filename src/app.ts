import express, { Application, Request, Response } from "express";
const app: Application = express();
const PORT: number = 3000;

// require("./model/index");
import * as dotenv from "dotenv";
dotenv.config();

import "./database/connection";

//Admin Seeder:
import adminSeeder from "./adminSeeder";
adminSeeder();

import userRoute from "./routes/userRoute";
app.use(express.json());
//localhost:3000/register || localhost:3000/x/register
app.use("", userRoute);

import productRoute from "./routes/productRoute";
app.use("", productRoute);
// app.get("/", (req: Request, res: Response) => {
//   res.send("Hello World");
// });
// app.get("/about", (req: Request, res: Response) => {
//   res.send("About Page");
// });
// app.get("/contact", (req: Request, res: Response) => {
//   res.send("Contact Page");
// });

app.listen(PORT, () => {
  console.log("Server has started at port:", PORT);
});
