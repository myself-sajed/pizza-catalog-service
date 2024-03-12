import {
    DeleteObjectCommand,
    PutObjectCommand,
    S3Client,
} from "@aws-sdk/client-s3";
import { ImageCRUD, ImageUploadData } from "../common/constants/ImageCRUDTypes";
import config from "config";

export class S3Storage implements ImageCRUD {
    private client: S3Client;
    constructor() {
        this.client = new S3Client({
            region: config.get("storage.region"),
            credentials: {
                accessKeyId: config.get("storage.accessKeyId"),
                secretAccessKey: config.get("storage.secretAccessKey"),
            },
        });
    }

    async upload(data: ImageUploadData): Promise<void> {
        const imageName = data.imageName;
        const imageData = data.imageData;

        const params = {
            Bucket: "pizza-catalog-service",
            Key: imageName,
            Body: imageData,
        };

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        await this.client.send(new PutObjectCommand(params));
    }

    async delete(oldImage: string): Promise<void> {
        const params = {
            Bucket: "pizza-catalog-service",
            Key: oldImage,
        };

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        await this.client.send(new DeleteObjectCommand(params));
    }
}
