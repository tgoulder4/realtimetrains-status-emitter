import { createServerActionProcedure } from "zsa";
import { PublicError } from "./errors";
function shapeErrors({ err }: any) {
    const isAllowedError = err instanceof PublicError;
    // lets all errors pass through to the UI so debugging locally is easier
    const isDev = process.env.NODE_ENV === "development";
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
export const unauthenticatedAction = createServerActionProcedure()
    .experimental_shapeError(shapeErrors)
    .handler(async () => {
        return { user: undefined };
    });