export function error(message: string): never {
    console.error(message);
    process.exit(1);
}

export function warning(message: string): void {
    console.warn(message);
}