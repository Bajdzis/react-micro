import { DependenciesService } from "@react-micro/dependencies-service";
import { ConsoleLogger } from "@react-micro/logger-service";
import { PubSub } from "@react-micro/pub-sub";
import { ConfigService } from "./ConfigService";

export const dependencies = DependenciesService.createDependenciesService()
    .registerClassService('logger',ConsoleLogger,[])
    .registerClassService('pubsub', PubSub, ['logger'])
    .registerClassService('configService',ConfigService,['logger'])
    .registerLazyValue('config', ({ configService }) => configService.get(),['configService'])
    .registerLazyValue('pubsubGlobal', async ({ pubsub }) => pubsub.createScope(
        'global',
        {
            openPage: PubSub.createActionCreator<{
                pageName:'homepage'|'about-us';
            }>(),
            clickElement: PubSub.createActionCreator<{
                element:'logo'|'nav';
            }>()
        }),
    ['pubsub'])
    .registerLazyValue('pubsubGlobalSubscriber', async ({ pubsubGlobal }) => {
        return pubsubGlobal.subscribeAction
    },['pubsubGlobal']);
