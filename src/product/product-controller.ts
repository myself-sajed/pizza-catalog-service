import { Request, Response } from "express";
import mime from "mime-types";
import { v4 as uuid } from "uuid";
import { validationResult } from "express-validator";
import { ProductService } from "./product-service";
import { ProductData } from "./product-types";
import { ImageCRUD } from "../common/constants/ImageCRUDTypes";
import { UploadedFile } from "express-fileupload";

export class ProductController {
    constructor(
        private productService: ProductService,
        private imageCRUDService: ImageCRUD,
    ) {}

    create = async (req: Request, res: Response) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const image = req.files!.image as UploadedFile;
        const imageId = uuid();
        const imageName = `${imageId}.${mime.extension(image.mimetype)}`;
        const imageData = image.data.buffer;

        // upload image here...
        const uploadResult = await this.imageCRUDService.upload({
            imageName,
            imageData,
        });

        console.log(uploadResult);

        const {
            name,
            description,
            priceConfiguration,
            attributes,
            tenantId,
            categoryId,
            isPublish,
        } = req.body as ProductData;

        const productData = {
            name,
            description,
            image: imageName,
            priceConfiguration: JSON.parse(priceConfiguration) as string,
            attributes: JSON.parse(attributes) as string,
            tenantId,
            categoryId,
            isPublish,
        };

        const product = await this.productService.create(productData);
        res.send(product);
    };

    // async update(req: Request, res: Response) {
    //     const result = validationResult(req);
    //     if (!result.isEmpty()) {
    //         return res.status(400).json({ errors: result.array() });
    //     }

    //     const { dataToUpdate, categoryIdToUpdate } =
    //         req.body as CategoryUpdateData;

    //     const category = await this.categoryService.update({
    //         dataToUpdate,
    //         categoryIdToUpdate,
    //     });

    //     res.send(category);
    // }

    // async getList(req: Request, res: Response) {
    //     const list = await this.categoryService.getList();
    //     res.send(list);
    // }

    // async getCategory(req: Request, res: Response) {
    //     const result = validationResult(req);
    //     if (!result.isEmpty()) {
    //         return res.status(400).json({ errors: result.array() });
    //     }

    //     const { id } = req.body as Record<string, string>;
    //     try {
    //         const category = await this.categoryService.getCategory(id);
    //         if (category) {
    //             res.send(category);
    //         } else {
    //             res.status(500).json({
    //                 message: `Could not delete find category with id: ${id}`,
    //             });
    //         }
    //     } catch (error) {
    //         res.status(500).json({
    //             message: `Could not delete find category with id: ${id}`,
    //         });
    //     }
    // }

    // async delete(req: Request, res: Response) {
    //     const result = validationResult(req);
    //     if (!result.isEmpty()) {
    //         return res.status(400).json({ errors: result.array() });
    //     }

    //     const { id } = req.body as Record<string, string>;

    //     try {
    //         await this.categoryService.delete(id);
    //         res.status(200).json({ message: "Category deleted successfully" });
    //     } catch (error) {
    //         res.status(500).json({
    //             message: `Could not delete category with id: ${id}`,
    //         });
    //     }
    // }
}
