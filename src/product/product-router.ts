import express, {
    NextFunction,
    Request,
    RequestHandler,
    Response,
} from "express";
import createHttpError from "http-errors";
import authenticateAccessToken from "../common/middlewares/authenticateAccessToken";
import canAccess from "../common/middlewares/canAccess";
import { Roles } from "../config/constants";
import productValidator from "./product-validator";
import { ProductService } from "./product-service";
import { ProductController } from "./product-controller";
import fileUpload from "express-fileupload";
import { S3Storage } from "../services/S3Storage";
import updateProductValidator from "./update-product-validator";
import { createMessageProducerBroker } from "../common/factories/brokerFactory";

// wrapper for each request controller for catching errors efficiently, because global error handler only does not catch error when they are thown in async functions
const asyncWrapper = (requestHandler: RequestHandler) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => {
            if (err instanceof Error) {
                next(createHttpError(500, err.message));
            }
            next(createHttpError(500, "Internal Server Error"));
        });
    };
};

const router = express.Router();
const productService = new ProductService();
const imageCRUDService = new S3Storage();
const broker = createMessageProducerBroker();
const productController = new ProductController(
    productService,
    imageCRUDService,
    broker,
);

router.post(
    "/create",
    authenticateAccessToken as RequestHandler,
    canAccess([Roles.Admin, Roles.Manager]),
    fileUpload(),
    productValidator,
    asyncWrapper(productController.create),
);
router.put(
    "/update/:productId",
    authenticateAccessToken as RequestHandler,
    canAccess([Roles.Admin, Roles.Manager]),
    fileUpload(),
    updateProductValidator,
    asyncWrapper(productController.update),
);
router.get("/getProducts", asyncWrapper(productController.getProducts));
router.get(
    "/getProduct/:productId",
    asyncWrapper(productController.getProduct),
);
router.get(
    "/deleteProduct/:productId",
    authenticateAccessToken as RequestHandler,
    canAccess([Roles.Admin, Roles.Manager]),
    asyncWrapper(productController.deleteProduct),
);

export default router;
