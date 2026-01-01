import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { createAuth } from "./auth";

const http = httpRouter();


http.route({
    pathPrefix: "/api/auth",
    method: "POST",
    handler: httpAction(async (ctx, request) => {
        const auth = createAuth(ctx);
        return auth.handler(request);
    }),
});

http.route({
    pathPrefix: "/api/auth",
    method: "GET",
    handler: httpAction(async (ctx, request) => {
        const auth = createAuth(ctx);
        return auth.handler(request);
    }),
});

export default http;
