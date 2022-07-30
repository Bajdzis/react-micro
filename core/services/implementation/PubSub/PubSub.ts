import { Logger } from "../../domain/Logger";
import { NullObjectLogger } from "../Looger/NullObjectLogger";

export class PubSub {
    private logger: Logger;
    private subscriber: (() => void)[];

    constructor({logger}: { logger: Logger} ){
        this.logger = logger;
        this.subscriber = [];
    }

    emit(event: string) {
        this.logger.log('info', `[EVENTS] emit ${event}`);
    }

    subscribe(event: string) {
        this.logger.log('info', `[EVENTS] emit ${event}`);
    }
}
