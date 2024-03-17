import { Request } from "express";

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

export interface RequestWithAuthInfo extends Request {
    auth: {
        sub: string;
        role: string;
        id?: string;
    };
}
