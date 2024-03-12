import ProductModel from "./product-model";
import { ProductData } from "./product-types";

export class ProductService {
    async create(productData: ProductData) {
        const product = new ProductModel(productData);
        return product.save();
    }
    async update(productId: string, productData: ProductData) {
        return await ProductModel.findOneAndUpdate(
            { _id: productId },
            { $set: productData },
            { new: true },
        );
    }

    async getProduct(productId: string) {
        return ProductModel.findOne({ _id: productId });
    }

    // async update(updateData: CategoryUpdateData) {
    //     const { categoryIdToUpdate, dataToUpdate } = updateData;
    //     try {
    //         const result = await CategoryModel.findOneAndUpdate(
    //             { _id: categoryIdToUpdate },
    //             dataToUpdate,
    //             { new: true },
    //         );

    //         if (result) {
    //             return result;
    //         } else {
    //             throw new Error(
    //                 "No matching category found with the id " +
    //                     categoryIdToUpdate,
    //             );
    //         }
    //     } catch (error) {
    //         if (error instanceof Error) {
    //             throw error.message;
    //         }
    //     }
    // }

    // async getList() {
    //     return await CategoryModel.find({});
    // }

    // async getCategory(id: string) {
    //     try {
    //         return await CategoryModel.findOne({ _id: id });
    //     } catch (error) {
    //         throw new Error(`Could not find category with id: ${id}`);
    //     }
    // }
    // async delete(id: string) {
    //     try {
    //         return await CategoryModel.findOneAndDelete({ _id: id });
    //     } catch (error) {
    //         throw new Error(`Could not delete category with id: ${id}`);
    //     }
    // }
}
