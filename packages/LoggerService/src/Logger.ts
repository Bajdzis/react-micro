export abstract class Logger {
    public abstract log(description:string, additional?: {[key: string]: any}):void;
    public abstract warn(description:string, additional?: {[key: string]: any}):void;
    public abstract error(description:string, additional?: {[key: string]: any}):void;
}
