import { TinyColor } from "@ctrl/tinycolor";
export const twColours = {
    primary: "zinc-900"
}
export const changeColour = (colour: string) => {
    return new TinyColor(colour)
}