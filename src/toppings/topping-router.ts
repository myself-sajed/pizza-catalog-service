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
import fileUpload from "express-fileupload";
import { S3Storage } from "../services/S3Storage";
import toppingValidator from "./topping-validator";
import { ToppingController } from "./topping-controller";
import { ToppingService } from "./topping-service";
import updateToppingValidator from "./update-topping-validator";

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
const toppingService = new ToppingService();
const imageCRUDService = new S3Storage();
const toppingController = new ToppingController(
    toppingService,
    imageCRUDService,
);

router.post(
    "/create",
    authenticateAccessToken as RequestHandler,
    canAccess([Roles.Admin, Roles.Manager]),
    fileUpload(),
    toppingValidator,
    asyncWrapper(toppingController.create),
);
router.put(
    "/update/:toppingId",
    authenticateAccessToken as RequestHandler,
    canAccess([Roles.Admin, Roles.Manager]),
    fileUpload(),
    updateToppingValidator,
    asyncWrapper(toppingController.update),
);
router.get("/getToppings", asyncWrapper(toppingController.getToppings));
router.get(
    "/getTopping/:toppingId",
    asyncWrapper(toppingController.getTopping),
);
router.get(
    "/deleteTopping/:toppingId",
    authenticateAccessToken as RequestHandler,
    canAccess([Roles.Admin, Roles.Manager]),
    asyncWrapper(toppingController.deleteTopping),
);

export default router;
