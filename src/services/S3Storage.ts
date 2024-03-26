import {
    DeleteObjectCommand,
    PutObjectCommand,
    S3Client,
} from "@aws-sdk/client-s3";
import { ImageCRUD, ImageUploadData } from "../common/constants/ImageCRUDTypes";
import config from "config";
import createHttpError from "http-errors";

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

        await this.client.send(new DeleteObjectCommand(params));
    }

    generateImageURL(filename: string): string {
        const bucket = config.get("storage.bucket");
        const region = config.get("storage.region");

        console.log("data is coming:", filename, bucket, region);

        if (typeof bucket === "string" && typeof region === "string") {
            return `https://${bucket}.s3.${region}.amazonaws.com/${filename}`;
        }

        const error = createHttpError(
            "503",
            "Invalid bucket configuration for generating image URLs",
        );
        throw error;
    }

    // async generateImageURL(filename: string){
    //     // https://pizza-catalog-service.s3.ap-south-1.amazonaws.com/46189b27-6f96-42ea-b3cd-176d388642bf.jpg

    //     const bucket = config.get("bucket")
    //     const region = config.get("region")

    //     if(bucket && region) return `https://${bucket}.s3.${region}.amazonaws.com/${filename}`

    //     const error =  createHttpError("503", "Invalid bucket configuration for generating image URLs")
    //     throw error
    // }
}
