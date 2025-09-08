export interface Debut {
    id: string;
    name: string;
    moves: string[];
}

export const debuts: Debut[] = [
    {
        id: "ruy-lopez",
        name: "Ruy Lopez",
        moves: ["e4", "e5", "Nf3", "Nc6", "Bb5"],
    },
    {
        id: "sicilian",
        name: "Sicilian Defense",
        moves: ["e4", "c5", "Nf3", "d6", "d4", "cxd4"],
    },
    {
        id: "french",
        name: "French Defense",
        moves: ["e4", "e6", "d4", "d5"],
    },
];
