import type { Logger } from "@react-micro/logger-service";

type Action<T extends string, P extends {[key: string]: any} | void> = {type: T; payload: P};

type ActionScope<T extends string, S extends string, P extends {[key: string]: any} | void> = {type: T; scope: S; payload: P};

type GetPayloadFromCreator<T extends (payload: any) => Action<string,any>> =  T extends (payload: infer R) => Action<string, infer R> ? R : any;

export class PubSub {
    private logger: Logger;
    private subscribers: ((action: ActionScope<string, string, {[key: string]: any} | void>) => void)[];

    constructor({logger}: { logger: Logger}){
        this.logger = logger;
        this.subscribers = [];
    }

    createScope<ActionsCreators extends ({[actionType: string]: (payload: any) => Action<string,any>})>(scope: string, actions: ActionsCreators) {
        this.logger.log(`[PubSub] createScope '${scope}'`);

        const actionKeys = Object.keys(actions);

        return {
            subscribeAction:<K extends keyof ActionsCreators & string>(type:K, subscriber: ((action: ActionScope<K, string, GetPayloadFromCreator<ActionsCreators[K]>>) => void)) => {
                if(!actionKeys.includes(type)) {
                    this.logger.warn(`[PubSub] You registry subscriber form unknown action '${scope}/${type}'`);
                }
                const checkType = (action :any): action is ActionScope<K, string, GetPayloadFromCreator<ActionsCreators[K]>> => {
                    return action.type === type && action.scope === scope;
                }
                return this.subscribe((action) => {
                    if(checkType(action)) {
                        subscriber(action);
                    }
                })
            },
            emitAction: <K extends (keyof ActionsCreators & string)>(type:K, payload:GetPayloadFromCreator<ActionsCreators[K]> ) => {
                if(!actionKeys.includes(type)) {
                    this.logger.warn(`[PubSub] You emit unknown action '${scope}/${type}'`);
                }
                this.logger.log(`[PubSub] Event '${scope}/${type}' emited`);
                const actionWithScope = {
                    type,
                    payload,
                    scope
                };
                this.subscribers.map(subscriber => {
                    subscriber(actionWithScope);
                });
            }
        }
    }

    subscribe(subscriber: ((action: ActionScope<string, string, {[key: string]: any} | void>) => void)) {
        this.logger.log(`[PubSub] subscribeEvent ${subscriber.name}`);
        this.subscribers.push(subscriber);

        return () => {
            this.subscribers = this.subscribers.filter(callback => callback !== subscriber);
        }
    }

    static createActionCreator <P extends {[key: string]: any} | void>(): (payload: P) => Action<string,P> {
        return (payload: P):Action<string,P> => ({
            type: 'string',
            payload
        })
    }
}
