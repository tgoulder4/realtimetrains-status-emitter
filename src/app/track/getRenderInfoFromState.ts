export function getColourFromStatus(status: string) {
    switch (status) {
        case "Wait":
            return "bg-yellow-800";
        case "Go":
            return "bg-green-800";
        case "Prepare":
            return "bg-slate-800";
        case "Error":
            return "bg-red-800";
        default:
            return "bg-red-800";
    }
}
export function getIntuitiveStatusFromStatus(status: string) {
    switch (status) {
        case "Wait":
            return "Wait on platform...";
        case "Go":
            return "Go, Go, Go!";
        case "Prepare":
            return "Hang on tight...";
        case "Error":
            return "Error";
        default:
            return "Error";
    }
}