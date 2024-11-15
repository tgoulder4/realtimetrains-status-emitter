import { env } from "@/env";
import { assertAuthenticated } from "@/lib/session";
import { createServerActionProcedure } from "zsa";
import { PublicError } from "./errors";

function shapeErrors({ err }: any) {
    const isAllowedError = err instanceof PublicError;
    // lets all errors pass through to the UI so debugging locally is easier
    const isDev = env.NODE_ENV === "development";
    if (isAllowedError || isDev) {
        console.error(err);
        return {
            code: err.code ?? "ERROR",
            message: `${err.message}`,
        };
    } else {
        return {
            code: "ERROR",
            message: "Something went wrong",
        };
    }
}
//type guard
export function isError(data: any): data is ReturnType<typeof shapeErrors> {
    return typeof data == 'object' && 'code' in data && 'message' in data;
}
export const authenticatedAction = createServerActionProcedure()
    .experimental_shapeError(shapeErrors)
    .handler(async () => {
        const user = await assertAuthenticated();
        return { user };
    });

export const unauthenticatedAction = createServerActionProcedure()
    .experimental_shapeError(shapeErrors)
    .handler(async () => {
        return { user: undefined };
    });
