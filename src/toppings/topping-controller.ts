import { Request, Response } from "express";
import { v4 as uuid } from "uuid";
import { validationResult } from "express-validator";
import {
    GetToppingFilter,
    RequestWithAuthInfo,
    ToppingData,
} from "./topping-types";
import { ImageCRUD } from "../common/constants/ImageCRUDTypes";
import { UploadedFile } from "express-fileupload";
import { ToppingService } from "./topping-service";
import { Roles } from "../config/constants";
import createHttpError from "http-errors";
import mime from "mime-types";
import { MessageProducerBroker } from "../common/constants/brokerType";

export class ToppingController {
    constructor(
        private toppingService: ToppingService,
        private imageCRUDService: ImageCRUD,
        private broker: MessageProducerBroker,
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

        const { name, price, tenantId, isPublish } = req.body as ToppingData;

        const toppingData = {
            name,
            price,
            image: imageName,
            tenantId,
            isPublish,
        };

        const topping = await this.toppingService.create(toppingData);

        await this.broker.sendMessage(
            "topping",
            JSON.stringify({
                _id: topping._id,
                price: topping.price,
            }),
        );

        res.send(topping);
    };

    update = async (req: Request, res: Response) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }
        const toppingId = req.params.toppingId;

        const currentTopping = (await this.toppingService.getTopping(
            toppingId,
        )) as ToppingData;

        const oldImage = currentTopping?.image;

        let imageName: string | undefined;

        const authReq = (req as RequestWithAuthInfo).auth;

        if (authReq.role !== Roles.Admin) {
            if (authReq?.tenant !== String(currentTopping?.tenantId)) {
                throw createHttpError(
                    500,
                    "You're not allowed to update this topping",
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

        const { name, price, tenantId, isPublish } = req.body as ToppingData;

        const toppingData = {
            name,
            price,
            image: imageName || oldImage,
            tenantId,
            isPublish,
        };

        const topping = await this.toppingService.update(
            toppingId,
            toppingData,
        );

        await this.broker.sendMessage(
            "topping",
            JSON.stringify({
                _id: topping._id,
                price: topping.price,
            }),
        );

        res.send(topping);
    };

    getTopping = async (req: Request, res: Response) => {
        const { toppingId } = req.params;
        const topping = (await this.toppingService.getTopping(
            toppingId,
        )) as ToppingData;
        res.status(200).send(topping);
    };

    deleteTopping = async (req: Request, res: Response) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const { toppingId } = req.params;
        const topping = (await this.toppingService.getTopping(
            toppingId,
        )) as ToppingData;

        if (topping) {
            await this.toppingService.deleteTopping(toppingId);
            await this.imageCRUDService.delete(topping.image);
            res.status(200).send({ msg: "deleted" });
        } else {
            res.status(500).send({ msg: "error" });
        }
    };

    getToppings = async (req: Request, res: Response) => {
        const { q, isPublish, price, tenantId } = req.query;

        const filter: GetToppingFilter = {};

        if (isPublish === "true") {
            filter.isPublish = true;
        }

        if (price) {
            filter.price = parseInt(price as string);
        }

        if (tenantId && tenantId !== "null" && tenantId !== "undefined")
            filter.tenantId = tenantId as string;

        const dbToppings = await this.toppingService.toppings(
            q as string,
            filter,
        );

        const toppings = dbToppings.map((product) => {
            const imageURL = this.imageCRUDService.generateImageURL(
                product.image,
            );
            return {
                ...product,
                image: imageURL,
            };
        });

        res.send(toppings);
    };
}
