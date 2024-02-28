export type priceType = "base" | "additional";
export type widgetType = "switch" | "radio";

export interface ProductData {
    name: string;
    description: string;
    image: string;
    priceConfiguration: string;
    attributes: string;
    tenantId: string;
    categoryId: string;
    isPublish: string;
}
