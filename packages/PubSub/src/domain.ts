type KeyOf<T extends object> = Extract<keyof T, string>;

type Subscribers<T extends ({[actionType: string]: any})>  = {
    [K in keyof T]: ((action: ActionScope<Extract<K, string>, string, T[K]>) => void)
}

export type ActionScope<T extends string, S extends string, P extends {[key: string]: any} | void> = {type: T; scope: S; payload: P};

export type UnSubscriber = () => void;

export type PubSubSubscriber<ActionsToPayload extends ({[actionType: string]: any})> = <T extends KeyOf<ActionsToPayload> > (subscribe: ( action: ActionScope<T, string, ActionsToPayload[T]> ) => void ) => UnSubscriber;

export interface PubSubScope<ActionsToPayload extends ({[actionType: string]: any})> {
    subscribeAction<T extends KeyOf<ActionsToPayload> >(type: T, subscriber: Subscribers<ActionsToPayload>[T] ):UnSubscriber;
    emitAction<T extends KeyOf<ActionsToPayload>>(type: T, payload: ActionsToPayload[T]):void;
}
