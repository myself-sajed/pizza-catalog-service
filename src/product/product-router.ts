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
const productController = new ProductController(
    productService,
    imageCRUDService,
);

router.post(
    "/create",
    authenticateAccessToken as RequestHandler,
    canAccess([Roles.Admin]),
    fileUpload(),
    productValidator,
    asyncWrapper(productController.create),
);

// router.post(
//     "/update",
//     authenticateAccessToken as RequestHandler,
//     canAccess([Roles.Admin]),
//     categoryUpdateValidator,
//     asyncWrapper(categoryController.update),
// );

// router.get(
//     "/getList",
//     authenticateAccessToken as RequestHandler,
//     asyncWrapper(categoryController.getList),
// );

// router.post(
//     "/getCategory",
//     authenticateAccessToken as RequestHandler,
//     categoryFindValidator,
//     asyncWrapper(categoryController.getCategory),
// );

// router.post(
//     "/delete",
//     authenticateAccessToken as RequestHandler,
//     categoryFindValidator,
//     asyncWrapper(categoryController.delete),
// );

export default router;
