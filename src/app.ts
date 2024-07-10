import express, { Request, Response } from "express";
import { globalErrorHandler } from "./common/middlewares/globalErrorHandler";
import categoryRouter from "./category/category-router";
import productRouter from "./product/product-router";
import toppingRouter from "./toppings/topping-router";
import cookieParser from "cookie-parser";
import cors from "cors";
import config from "config";

const app = express();

const ORIGIN_URI_Admin = config.get("server.originURIAdmin");
const ORIGIN_URI_Client = config.get("server.originURIClient");
app.use(
    cors({
        origin: [ORIGIN_URI_Admin as string, ORIGIN_URI_Client as string],
        credentials: true,
    }),
);

app.use(express.json());
app.use(cookieParser());

//routes
app.get("/", (req: Request, res: Response) => {
    res.json({ message: "Hello from catalog service!" });
});

app.use("/categories", categoryRouter);
app.use("/products", productRouter);
app.use("/toppings", toppingRouter);

app.use(globalErrorHandler);

export default app;
