export interface Logger {
    log(description:string, additional?: {[key: string]: any}):void;
    warn(description:string, additional?: {[key: string]: any}):void;
    error(description:string, additional?: {[key: string]: any}):void;
}
