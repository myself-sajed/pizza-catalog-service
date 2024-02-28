import { Request } from "express";

export interface UserInfo {
    name: string;
    email: string;
    password: string;
    role: string;
    tenantId?: string;
}

export interface RequestWithUserInfo extends Request {
    body: UserInfo;
}

export interface RequestWithAuthInfo extends Request {
    auth: {
        sub: string;
        role: string;
        id?: string;
    };
}
