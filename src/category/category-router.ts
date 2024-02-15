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
router.post("/", categoryValidator, asyncWrapper(categoryController.create));

export default router;
