import { DependenciesService } from "@react-micro/dependencies-service";
import { ConsoleLogger } from "@react-micro/logger-service";
import { PubSub } from "@react-micro/pub-sub";
import { ConfigService } from "./services/ConfigService";

export const dependencies = DependenciesService.createDependenciesService()
    .registerClassService('logger',ConsoleLogger,[])
    .registerClassService('pubsub', PubSub, ['logger'])
    .registerClassService('configService',ConfigService,['logger'])
    .registerLazyValueArray(['config', ({ configService }) => configService.get(),['configService']])
    .registerLazyValue('pubsubGlobal', async ({ pubsub }) => pubsub.createScope<{
        openPage: 'homepage'|'about-us',
        clickElement: {
            element:'logo'|'nav';
        },
    }>(
        'global',
        ['openPage', 'clickElement']
     ),
    ['pubsub'])
    .registerLazyValue('pubsubGlobalSubscriber', async ({ pubsubGlobal }) => {
        return pubsubGlobal.subscribeAction
    },['pubsubGlobal']);
