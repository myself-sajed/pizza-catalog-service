import express, {
    NextFunction,
    Request,
    RequestHandler,
    Response,
} from "express";
import { CategoryController } from "./category-controller";
import categoryValidator from "./category-validator";
import { CategoryService } from "./category-service";
import createHttpError from "http-errors";
import authenticateAccessToken from "../common/middlewares/authenticateAccessToken";
import canAccess from "../common/middlewares/canAccess";
import { Roles } from "../config/constants";
import categoryUpdateValidator from "./category-update-validator";
import categoryFindValidator from "./category-find-validator";

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
const categoryService = new CategoryService();
const categoryController = new CategoryController(categoryService);

router.post(
    "/create",
    authenticateAccessToken as RequestHandler,
    canAccess([Roles.Admin]),
    categoryValidator,
    asyncWrapper(categoryController.create),
);

router.post(
    "/update",
    authenticateAccessToken as RequestHandler,
    canAccess([Roles.Admin]),
    categoryUpdateValidator,
    asyncWrapper(categoryController.update),
);

router.get("/getList", asyncWrapper(categoryController.getList));

router.post(
    "/getCategory",
    authenticateAccessToken as RequestHandler,
    categoryFindValidator,
    asyncWrapper(categoryController.getCategory),
);

router.post(
    "/delete",
    authenticateAccessToken as RequestHandler,
    categoryFindValidator,
    asyncWrapper(categoryController.delete),
);

export default router;
