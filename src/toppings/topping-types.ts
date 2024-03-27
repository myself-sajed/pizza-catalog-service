import { Request } from "express";

export type priceType = "base" | "additional";
export type widgetType = "switch" | "radio";

export interface ToppingData {
    id?: string;
    name: string;
    price: number;
    image: string;
    tenantId: string;
    isPublish: string;
}

export interface RequestWithAuthInfo extends Request {
    auth: {
        sub: string;
        role: string;
        id?: string;
        tenant?: string;
    };
}
export interface GetToppingFilter {
    isPublish?: boolean;
    tenantId?: string;
    price?: number;
}

export interface PaginationFilters {
    page: number;
    limit: number;
}
