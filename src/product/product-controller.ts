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
        await this.imageCRUDService.upload({
            imageName,
            imageData,
        });

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

    update = async (req: Request, res: Response) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const productId = req.params.productId;

        const currentProduct = await this.productService.getProduct(productId);
        const oldImage = currentProduct?.image as string;

        let imageName: string | undefined;

        console.log("Image data is here :", req.files?.image);

        if (req.files?.image) {
            const image = req.files.image as UploadedFile;
            const imageId = uuid();
            imageName = `${imageId}.${mime.extension(image.mimetype)}`;
            const imageData = image.data.buffer;
            await this.imageCRUDService.upload({
                imageName,
                imageData,
            });

            await this.imageCRUDService.delete(oldImage);
        }

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
            image: imageName || oldImage,
            priceConfiguration: JSON.parse(priceConfiguration) as string,
            attributes: JSON.parse(attributes) as string,
            tenantId,
            categoryId,
            isPublish,
        };

        const product = await this.productService.update(
            productId,
            productData,
        );
        res.send(product);
    };
}
