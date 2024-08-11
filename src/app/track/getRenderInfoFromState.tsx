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
            return "Wait near platform...";
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
export function getGlyphFromStatus(status: string) {
    switch (status) {
        case "Wait":
            return <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.6667 2.3335H16.3333" stroke="black" stroke-opacity="0.45" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M14 16.3335L17.5 12.8335" stroke="black" stroke-opacity="0.45" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M14 25.6667C19.1546 25.6667 23.3333 21.488 23.3333 16.3333C23.3333 11.1787 19.1546 7 14 7C8.84533 7 4.66666 11.1787 4.66666 16.3333C4.66666 21.488 8.84533 25.6667 14 25.6667Z" stroke="black" stroke-opacity="0.45" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>

        case "Go":
            return <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 7L8.16671 19.8333L2.33337 14" stroke="black" stroke-opacity="0.45" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M25.6666 11.6665L16.9166 20.4165L15.1666 18.6665" stroke="black" stroke-opacity="0.45" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>

        case "Prepare":
            return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 22H19" stroke="#828282" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M5 2H19" stroke="#828282" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M17 22V17.828C16.9999 17.2976 16.7891 16.789 16.414 16.414L12 12L7.586 16.414C7.2109 16.789 7.00011 17.2976 7 17.828V22" stroke="#828282" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M7 2V6.172C7.00011 6.70239 7.2109 7.21101 7.586 7.586L12 12L16.414 7.586C16.7891 7.21101 16.9999 6.70239 17 6.172V2" stroke="#828282" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        default:
            return <></>
    }
}
export function getDescriptionFromStatus(status: string) {
    switch (status) {
        case "Wait":
            return "Wait near the platform, we’ll let you know when to go onto it. Shouldn’t be long, promise.";
        case "Go":
            return "No more waiting! Got what it takes to be the first onboard?";
        case "Prepare":
            return "You got us. We’re preparing the platform for you. Refresh the page within an hour of the train's scheduled departure.";
        case "Error":
            return "There was an error. Sorry about that.";
        default:
            return "There was an error. Sorry about that.";
    }
}