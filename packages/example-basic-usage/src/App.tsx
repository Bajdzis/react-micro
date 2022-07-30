import { DependenciesService } from '@react-micro/dependencies-service';
import { ConsoleLogger } from '@react-micro/logger-service';
import { createApp, SimpleLayout } from '@react-micro/react-wrappers';

const dependencies = DependenciesService.createDependenciesService()
  .registerClassService('logger',ConsoleLogger)
  .registerLazyValue('config', () => {
    return 'aaa'
  });

export const App = createApp(SimpleLayout,dependencies,{
  Content: () => <div>content</div>,
  Menu: () => {

  return <div>menu</div>},
  Footer: () => <div>footer</div>,
});

