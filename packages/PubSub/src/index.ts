import type { Logger } from "@react-micro/logger-service";

type Action<T extends string, P extends {[key: string]: any} | void = void> = {type: T; payload: P};

type ActionScope<T extends string, S extends string, P extends {[key: string]: any} | void = void> = {type: T; scope: S; payload: P};

export class PubSub {
    private logger: Logger;
    private subscribers: ((action: ActionScope<string, string, {[key: string]: any} | void>) => void)[];

    constructor({logger}: { logger: Logger}){
        this.logger = logger;
        this.subscribers = [];
    }

    createScope<S extends string>(scope: S) {
        this.logger.log('info', `[PubSub] createScope '${scope}'`);

        return {
            createAction: PubSub.createAction,
            emit: (action: Action<string, {[key: string]: any} | void>) => {
                const actionWithScope = {
                    ...action,
                    scope
                };
                this.subscribers.map(subscriber => {
                    subscriber(actionWithScope);
                });
                // @ts-ignore
                delete action.payload;
            }
        }
    }

    subscribeEvent(subscriber: ((action: ActionScope<string, string, {[key: string]: any} | void>) => void)) {
        this.logger.log('info', `[PubSub] subscribeEvent ${subscriber.name}`);
        this.subscribers.push(subscriber);

        return () => {
            this.subscribers = this.subscribers.filter(callback => callback !== subscriber);
        }
    }

    static createAction <T extends string, P extends {[key: string]: any} | void = void>(type: T): (payload: P) => Action<T,P> {
        return (payload: P):Action<T,P> => ({
            type,
            payload
        })
    }
}

export const createPubSubScope = <T extends string>(scope:T) => ({pubSub}: { pubSub: PubSub}) => pubSub.createScope<T>(scope)

