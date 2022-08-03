import { Logger } from "./Logger";
export class NullObjectLogger implements Logger {
    log() {}
    warn() {}
    error() {}
}
