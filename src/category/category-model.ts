import mongoose, { Schema } from "mongoose";

export type priceType = "base" | "additional";
export type widgetType = "switch" | "radio";

interface Attributes {
    name: string;
    widgetType: widgetType;
    defaultValue: string;
    availableOptions: string[];
}

interface PriceConfiguration {
    [key: string]: {
        priceType: priceType;
        availableOptions: string[];
    };
}

interface Category {
    name: string;
    price: PriceConfiguration;
    attributes: Attributes[];
}

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
