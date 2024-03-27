import ToppingModel from "./topping-model";
import { GetToppingFilter, ToppingData } from "./topping-types";

export class ToppingService {
    async create(toppingData: ToppingData) {
        return (await ToppingModel.create(toppingData)) as ToppingData;
    }

    async update(toppingId: string, toppingData: ToppingData) {
        return (await ToppingModel.findOneAndUpdate(
            { _id: toppingId },
            { $set: toppingData },
            { new: true },
        )) as ToppingData;
    }

    async getTopping(toppingId: string) {
        return ToppingModel.findOne({ _id: toppingId });
    }

    async deleteTopping(toppingId: string) {
        return ToppingModel.deleteOne({ _id: toppingId });
    }

    async toppings(q: string, filters: GetToppingFilter) {
        const query = new RegExp(q, "i");

        const matchQuery = {
            ...filters,
            name: query,
        };

        const aggregate = ToppingModel.aggregate([
            {
                $match: matchQuery,
            },
        ]);

        const toppings = await aggregate.exec();

        return toppings as ToppingData[];
    }
}
