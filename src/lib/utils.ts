export function getProgressChar(percentage: number) {
    const progressChar = ["░","▒","▓","█"];
    const stepsCompleted = Math.floor(percentage / (1 / 3));
    const inStepsCompleted = Math.floor((percentage % (1 / 3)) / (1 / 3 / 4));

    let string = "";
    for (let i = 0; i < 3; i++) {
        if (i < stepsCompleted) {
        string += progressChar[3]; // full block
        } else if (i === stepsCompleted) {
        string += progressChar[Math.min(inStepsCompleted, 3)];
        } else {
        string += progressChar[0]; // empty
        }
    }

    return string;
}

export const progressChar = ["░","▒","▓","█"];