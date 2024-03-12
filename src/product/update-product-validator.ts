import { body } from "express-validator";

export default [
    body("name").exists().withMessage("A valid category name is required"),
    body("description").exists().withMessage("A valid description is required"),
    body("tenantId").exists().withMessage("The tenantId field is missing"),
    body("categoryId").exists().withMessage("The categoryId field is missing"),
    body("isPublish").exists().withMessage("The isPublish field is missing"),
    body("priceConfiguration")
        .exists()
        .withMessage("priceConfiguration field is missing"),
    body("attributes").exists().withMessage("Attribute field is missing"),
];
