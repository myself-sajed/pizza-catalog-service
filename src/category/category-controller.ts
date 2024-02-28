import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { CategoryService } from "./category-service";
import { Category, CategoryUpdateData } from "./category-types";

export class CategoryController {
    constructor(private categoryService: CategoryService) {
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.getList = this.getList.bind(this);
        this.getCategory = this.getCategory.bind(this);
        this.delete = this.delete.bind(this);
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

    async update(req: Request, res: Response) {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const { dataToUpdate, categoryIdToUpdate } =
            req.body as CategoryUpdateData;

        const category = await this.categoryService.update({
            dataToUpdate,
            categoryIdToUpdate,
        });

        res.send(category);
    }

    async getList(req: Request, res: Response) {
        const list = await this.categoryService.getList();
        res.send(list);
    }

    async getCategory(req: Request, res: Response) {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const { id } = req.body as Record<string, string>;
        try {
            const category = await this.categoryService.getCategory(id);
            if (category) {
                res.send(category);
            } else {
                res.status(500).json({
                    message: `Could not delete find category with id: ${id}`,
                });
            }
        } catch (error) {
            res.status(500).json({
                message: `Could not delete find category with id: ${id}`,
            });
        }
    }

    async delete(req: Request, res: Response) {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const { id } = req.body as Record<string, string>;

        try {
            await this.categoryService.delete(id);
            res.status(200).json({ message: "Category deleted successfully" });
        } catch (error) {
            res.status(500).json({
                message: `Could not delete category with id: ${id}`,
            });
        }
    }
}
