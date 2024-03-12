export interface ImageUploadData {
    imageName: string;
    imageData: ArrayBuffer;
}

export interface ImageCRUD {
    upload: (data: ImageUploadData) => Promise<void>;
    delete: (imageId: string) => Promise<void>;
    // getImage: () => Promise<void>;
}
