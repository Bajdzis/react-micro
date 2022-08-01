import { Logger } from "./Logger";
export class NullObjectLogger extends Logger {
    log() {}
    warn() {}
    error() {}
}
