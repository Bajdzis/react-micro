import { Logger, LoggerGroupName } from "./Logger";

export class ConsoleLogger extends Logger {
    log(group: LoggerGroupName, description: string){
        console.log(group, description);
    };

    logObject(group: LoggerGroupName, description: {[key: string]: any}) {
        console.log(group, description);
    };
}
