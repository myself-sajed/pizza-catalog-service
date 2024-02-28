import CategoryModel from "./category-model";
import { Category, CategoryUpdateData } from "./category-types";

export class CategoryService {
    async create(categoryData: Category) {
        const category = new CategoryModel(categoryData);
        return category.save();
    }

    async update(updateData: CategoryUpdateData) {
        const { categoryIdToUpdate, dataToUpdate } = updateData;
        try {
            const result = await CategoryModel.findOneAndUpdate(
                { _id: categoryIdToUpdate },
                dataToUpdate,
                { new: true },
            );

            if (result) {
                return result;
            } else {
                throw new Error(
                    "No matching category found with the id " +
                        categoryIdToUpdate,
                );
            }
        } catch (error) {
            if (error instanceof Error) {
                throw error.message;
            }
        }
    }

    async getList() {
        return await CategoryModel.find({});
    }

    async getCategory(id: string) {
        try {
            return await CategoryModel.findOne({ _id: id });
        } catch (error) {
            throw new Error(`Could not find category with id: ${id}`);
        }
    }
    async delete(id: string) {
        try {
            return await CategoryModel.findOneAndDelete({ _id: id });
        } catch (error) {
            throw new Error(`Could not delete category with id: ${id}`);
        }
    }
}
