import productModel from "./product-model";
import ProductModel from "./product-model";
import { GetProductFilter, ProductData } from "./product-types";

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

    async getProducts(q: string, filters: GetProductFilter) {
        const query = new RegExp(q, "i");

        const matchQuery = {
            ...filters,
            name: query,
        };

        const aggregate = productModel.aggregate([
            {
                $match: matchQuery,
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "categoryId",
                    as: "category",
                    foreignField: "_id",
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                price: 1,
                                attributes: 1,
                            },
                        },
                    ],
                },
            },
            {
                $unwind: "$category",
            },
        ]);

        const products = await aggregate.exec();

        return products as ProductData[];
    }
}
