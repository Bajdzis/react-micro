import { AppService, SimpleLayout } from '@react-micro/react-wrappers';
import { Footer } from './components/Footer';
import { Menu } from './components/Menu';
import { dependencies } from './dependencies';

 const appCreator = AppService.createAppCreator(dependencies)
  .addSlot('Content', async () => {
    const Content = await import('./components/Content');
    return Content.default;
  },[])
  .addSlot('Menu', () => Menu, ['config', 'pubsubGlobal'])
  .addSlot('Footer',  () => Footer,['pubsubGlobalSubscriber'])

export const App = appCreator.createApp(SimpleLayout);
