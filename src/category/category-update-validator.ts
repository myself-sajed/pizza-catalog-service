import { body } from "express-validator";
import { priceType } from "./category-types";

export default [
    body("categoryIdToUpdate"),
    body("dataToUpdate.name")
        .exists()
        .withMessage("A valid category name is required"),
    body("dataToUpdate.price").exists().withMessage("Price field is missing"),
    body("dataToUpdate.price.*.priceType")
        .exists()
        .withMessage("Price type field is missing")
        .custom((value: priceType) => {
            const types = ["base", "additional"];
            if (!types.includes(value)) {
                throw new Error(
                    `Invalid price type ${value}. It should be one of ${types.join(
                        ", ",
                    )}`,
                );
            }

            return true;
        }),
    body("dataToUpdate.attributes")
        .exists()
        .withMessage("Attribute field is missing"),
];
