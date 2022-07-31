import { DependenciesService } from "@react-micro/dependencies-service";
import { ConsoleLogger } from "@react-micro/logger-service";
import { ConfigService } from "./ConfigService";

export const dependencies = DependenciesService.createDependenciesService()
    .registerClassService('logger',ConsoleLogger,[])
    .registerClassService('configService',ConfigService,['logger'])
    .registerLazyValue('config', ({ configService }) => configService.get(),[ 'configService']);
