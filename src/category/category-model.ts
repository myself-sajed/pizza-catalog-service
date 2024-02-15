import mongoose, { Schema } from "mongoose";
import { Attributes, Category, PriceConfiguration } from "./category-types";

const priceSchema = new mongoose.Schema<PriceConfiguration>({
    priceType: {
        type: String,
        enum: ["base", "additional"],
        required: true,
    },
    availableOptions: {
        type: [String],
        required: true,
    },
});

const attributesSchema = new mongoose.Schema<Attributes>({
    name: {
        type: String,
        required: true,
    },
    widgetType: {
        type: String,
        enum: ["radio", "switch"],
        required: true,
    },
    defaultValue: {
        type: Schema.Types.Mixed,
        required: true,
    },
    availableOptions: {
        type: [String],
        required: true,
    },
});

const categorySchema = new mongoose.Schema<Category>({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Map,
        of: priceSchema,
        required: true,
    },
    attributes: {
        type: [attributesSchema],
        required: true,
    },
});

export default mongoose.model("Category", categorySchema);
