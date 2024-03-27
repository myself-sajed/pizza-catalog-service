import { Request, Response } from "express";
import mime from "mime-types";
import { v4 as uuid } from "uuid";
import { validationResult } from "express-validator";
import { ProductService } from "./product-service";
import { GetProductFilter, ProductData } from "./product-types";
import { ImageCRUD } from "../common/constants/ImageCRUDTypes";
import { UploadedFile } from "express-fileupload";
import { RequestWithAuthInfo } from "../config";
import { Roles } from "../config/constants";
import createHttpError from "http-errors";
import mongoose from "mongoose";

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
        const imageName = imageId;
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

        const currentProduct = (await this.productService.getProduct(
            productId,
        )) as ProductData;
        const oldImage = currentProduct?.image;

        let imageName: string | undefined;

        const authReq = (req as RequestWithAuthInfo).auth;

        if (authReq.role !== Roles.Admin) {
            if (authReq?.tenant !== String(currentProduct?.tenantId)) {
                throw createHttpError(
                    500,
                    "You're not allowed to update this product",
                );
            }
        }

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

    getProduct = async (req: Request, res: Response) => {
        const { productId } = req.params;
        const product = (await this.productService.getProduct(
            productId,
        )) as ProductData;
        res.status(200).send(product);
    };

    deleteProduct = async (req: Request, res: Response) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const { productId } = req.params;
        const product = (await this.productService.getProduct(
            productId,
        )) as ProductData;

        if (product) {
            await this.productService.deleteProduct(productId);
            await this.imageCRUDService.delete(product.image);

            res.status(200).send({ msg: "deleted" });
        } else {
            res.status(500).send({ msg: "error" });
        }
    };

    getProducts = async (req: Request, res: Response) => {
        const { q, isPublish, categoryId, tenantId } = req.query;
        const paginateFilters = {
            page: req.query.page ? parseInt(req.query.page as string) : 1,
            limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
        };

        const filter: GetProductFilter = {};

        if (isPublish === "true") {
            filter.isPublish = true;
        }

        if (
            categoryId &&
            mongoose.Types.ObjectId.isValid(categoryId as string)
        ) {
            filter.categoryId = new mongoose.Types.ObjectId(
                categoryId as string,
            );
        }

        if (tenantId) filter.tenantId = tenantId as string;

        const dbProducts = await this.productService.getProducts(
            q as string,
            filter,
            paginateFilters,
        );

        const products = (dbProducts.data as ProductData[]).map((product) => {
            const imageURL = this.imageCRUDService.generateImageURL(
                product.image,
            );
            return {
                ...product,
                image: imageURL,
            };
        });

        res.send({
            data: products,
            total: dbProducts.total,
            pageSize: dbProducts.pageSize,
            currentPage: dbProducts.currentPage,
        });
    };
}
