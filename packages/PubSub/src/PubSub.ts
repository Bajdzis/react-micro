import type { Logger } from "@react-micro/logger-service";
import type { ActionScope, UnSubscriber, PubSubSubscriber, PubSubScope } from "./domain";

type KeyOf<T extends object> = Extract<keyof T, string>;

interface PubSubI {
    subscribe: PubSubSubscriber<{
        [key: string]: any
    }>
}
export class PubSub<Scope extends string = string>  implements PubSubI {
    private logger: Logger;
    private subscribers: ((action: ActionScope<string, Scope, {[key: string]: any}>) => void)[];

    constructor({logger}: { logger: Logger}){
        this.logger = logger;
        this.subscribers = [];
    }

    createScope<ActionsToPayload extends ({[actionType: string]: any})>(scope: Scope, actionsNames: (keyof ActionsToPayload)[] = []): PubSubScope<ActionsToPayload> {
        this.logger.log(`[PubSub] createScope '${scope}' ${actionsNames.length === 0 ? 'without action name checker' : `with actions ${actionsNames.join(', ')}`}`);

        return {
            subscribeAction:<K extends KeyOf<ActionsToPayload>>(type:K, subscriber: ((action: ActionScope<K, string, ActionsToPayload[K]>) => void)): UnSubscriber => {
                if(!actionsNames.includes(type)) {
                    this.logger.warn(`[PubSub] You registry subscriber for unknown action '${scope}/${type}'`);
                }
                const checkType = (action :any): action is ActionScope<K, string, ActionsToPayload[K]> => {
                    return action.type === type && action.scope === scope;
                }
                return this.subscribe((action) => {
                    if(checkType(action)) {
                        subscriber(action);
                    }
                })
            },
            emitAction: <K extends KeyOf<ActionsToPayload>>(type:K, payload:ActionsToPayload[K]) => {
                if(!actionsNames.includes(type)) {
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

    subscribe(subscriber: ((action: ActionScope<any, Scope, {[key: string]: any}>) => void)) {
        this.logger.log(`[PubSub] subscribeEvent ${subscriber.name}`);
        this.subscribers.push(subscriber);

        return () => {
            this.subscribers = this.subscribers.filter(callback => callback !== subscriber);
        }
    }

}
