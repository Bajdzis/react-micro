import { Logger } from "./Logger";

export class ConsoleLogger extends Logger {
    public log(description:string, additional?: { [key: string]: any; } | undefined): void {
        console.log(description, additional);
    }

    public warn(description:string, additional?: { [key: string]: any; } | undefined): void {
        console.warn(description, additional);
    }

    public error(description:string, additional?: { [key: string]: any; } | undefined): void {
        console.error(description, additional);
    }
}
