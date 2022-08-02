import { AppService } from '@react-micro/app-service';
import { SimpleLayout } from '@react-micro/layouts';
import { Footer } from './components/Footer';
import { Menu } from './components/Menu';
import { dependencies } from './dependencies';

const appCreator = AppService.createAppCreator(dependencies)
  .addSlotImport('Content', () => import('./components/Content'), [])
  .addSlot('Menu', () => Menu, ['config', 'pubsubGlobal'])
  .addSlot('Footer',  () => Footer,['pubsubGlobalSubscriber'])

export const App = appCreator.createApp(SimpleLayout, <div>{'Loading...'}</div>);
