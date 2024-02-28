import { expressjwt, GetVerificationKey, Request } from "express-jwt";
import jwksClient from "jwks-rsa";
import config from "config";

export default expressjwt({
    secret: jwksClient.expressJwtSecret({
        jwksUri: config.get("auth.secrete"),
        cache: true,
        rateLimit: true,
    }) as GetVerificationKey,
    algorithms: ["RS256"],
    getToken: (req: Request) => {
        // making it flexible for both headers and cookies
        const authHeaders = req.headers.authorization;
        if (authHeaders && authHeaders.split(" ")[1] !== "undefined") {
            const token = authHeaders.split(" ")[1];

            if (token) {
                return token;
            }
        }

        interface AuthCookies {
            accessToken: string;
        }

        const { accessToken } = req.cookies as AuthCookies;

        if (accessToken) {
            return accessToken;
        } else {
            return undefined;
        }
    },
});
