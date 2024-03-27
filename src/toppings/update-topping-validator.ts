import { body } from "express-validator";

export default [
    body("name").exists().withMessage("A valid category name is required"),
    body("price").exists().withMessage("A valid price is required"),
    body("tenantId").exists().withMessage("The tenantId field is missing"),
    body("isPublish").exists().withMessage("The isPublish field is missing"),
];
