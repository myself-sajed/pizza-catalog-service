import { body } from "express-validator";

export default [
    body("name").exists().withMessage("A valid category name is required"),
    body("tenantId").exists().withMessage("The tenantId field is missing"),
    body("price").exists().withMessage("The price field is missing"),
    body("isPublish").exists().withMessage("The isPublish field is missing"),
    body("image").custom((value, { req }) => {
        if (!req.files) {
            throw new Error(`Invalid image used in the form`);
        }
        return true;
    }),
];
