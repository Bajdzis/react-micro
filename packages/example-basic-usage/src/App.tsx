import { DependenciesService } from '@react-micro/dependencies-service';
import { ConsoleLogger } from '@react-micro/logger-service';
import { AppService, SimpleLayout } from '@react-micro/react-wrappers';

const sleep = () => {
  return new Promise<void>((resolve) => setTimeout(resolve, 1000))
}

const dependencies = DependenciesService.createDependenciesService()
  .registerClassService('logger',ConsoleLogger,[])
  .registerLazyValue('language', async ({logger}) => {
    logger.log('info', 'fetch language')
    await sleep()
    return 'en';
  },['logger'])
  .registerLazyValue('config', async ({ language, logger}) => {
    logger.log('info', 'fetch config')
    await sleep()
    return {
      siteTitle: language === 'en' ? 'Title In Menu' : 'unknown'
    }
  },[ 'language', 'logger']);

function Content () {
  return <div>content24422</div>;
};

export const App = AppService.createDependenciesService(dependencies)
  .addSlot('Content', () => Content,[])
  .addSlot('Menu', async () => ({dependencies}) => <div>{dependencies.config.siteTitle}</div>,['config','logger'])
  .addSlot('Footer',  () => () => <div>footer</div>,[])
  .createApp(SimpleLayout);

