export type LoggerGroupName = 'fatal'|'warning'|'info';


export abstract class Logger {
    public abstract log(group: LoggerGroupName, description: string):void;
    public abstract logObject(group: LoggerGroupName, description: {[key: string]: any}):void;
}
