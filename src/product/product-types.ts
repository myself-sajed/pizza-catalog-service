import { Request } from "express";
import mongoose from "mongoose";

export type priceType = "base" | "additional";
export type widgetType = "switch" | "radio";

export interface ProductData {
    _id?: string;
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
export interface GetProductFilter {
    isPublish?: boolean;
    tenantId?: string;
    categoryId?: mongoose.Types.ObjectId;
}

export interface PaginationFilters {
    page: number;
    limit: number;
}
