import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { CategoryService } from "./category-service";
import { Category } from "./category-types";

export class CategoryController {
    constructor(private categoryService: CategoryService) {
        this.create = this.create.bind(this);
    }

    async create(req: Request, res: Response) {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const { name, price, attributes } = req.body as Category;

        const category = await this.categoryService.create({
            name,
            price,
            attributes,
        });

        res.send({ id: category._id, name: name });
    }
}
