import { paginationLabels } from "../config/constants";
import productModel from "./product-model";
import ProductModel from "./product-model";
import {
    GetProductFilter,
    PaginationFilters,
    ProductData,
} from "./product-types";

export class ProductService {
    async create(productData: ProductData) {
        return (await ProductModel.create(productData)) as ProductData;
    }

    async update(productId: string, productData: ProductData) {
        return (await ProductModel.findOneAndUpdate(
            { _id: productId },
            { $set: productData },
            { new: true },
        )) as ProductData;
    }

    async getProduct(productId: string) {
        return ProductModel.findOne({ _id: productId });
    }

    async getProducts(
        q: string,
        filters: GetProductFilter,
        paginationFilters: PaginationFilters,
    ) {
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

        const products = await ProductModel.aggregatePaginate(aggregate, {
            ...paginationFilters,
            customLabels: paginationLabels,
        });

        return products;
    }
}

// https://pizza-catalog-service.s3.ap-south-1.amazonaws.com/46189b27-6f96-42ea-b3cd-176d388642bf.jpg
// https://pizza-catalog-service.s3.ap-south-1.amazonaws.com/9ea954a6-d42e-4b0e-a8b0-d6d14ad00bb7.jpeg
