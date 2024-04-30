export type priceType = "base" | "additional";
export type widgetType = "switch" | "radio";

export interface Attributes {
    name: string;
    widgetType: widgetType;
    defaultValue: string;
    availableOptions: string[];
}

export interface PriceConfiguration {
    [key: string]: {
        priceType: priceType;
        availableOptions: string[];
    };
}

export interface Category {
    name: string;
    price: PriceConfiguration;
    attributes: Attributes[];
    hasToppings: boolean;
}
export interface CategoryUpdateData {
    categoryIdToUpdate: string;
    dataToUpdate: Category;
}
