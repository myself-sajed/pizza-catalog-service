import { body } from "express-validator";

export default [
    body("id").exists().withMessage("A valid category id is required"),
];
