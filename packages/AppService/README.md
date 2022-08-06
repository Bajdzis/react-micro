# React micro / App service

This package is a part of `react-micro` is a collection for create app component.
## Instal

Install this service with peer dependecies.

```bash
npm i @react-micro/app-service @react-micro/dependencies-service --save
```

## API

### createAppCreator(dependencies: DependenciesService)

It is a static function for create new instance app services.

#### params

- dependencies: `DependenciesServic` - Instance of DependenciesServic from package `@react-micro/dependencies-service`

#### example

```typescript
import { AppService } from "@react-micro/app-service";
import { DependenciesService } from "@react-micro/dependencies-service";

const dependenciesServiceInstance: DependenciesService = ...;

const appServiceInstance: AppService = AppService.createAppCreator(dependenciesServiceInstance)

```


### addSlot(slotName: string, componentCreator: () => React.ComponentType | Promise<React.ComponentType>, dependenciesNames: string[])


#### Params

- slotName: `string` - Uniqe component name starts from uppercase letter.
- componentCreator: `() => React.ComponentType | Promise<React.ComponentType>` - Function to create React component.
- dependenciesNames: `string[]` - List of dependencies from `DependenciesServic`. All dependencies will be pass as props for created Component from `componentCreator`


#### Example

```jsx
const Home = ({ dependencies }) = {
    const { config } = dependencies;

    return <div>[...]</div>;
}

const appServiceInstance: AppService = AppService.createAppCreator(dependenciesServiceInstance)
    .addSlot('HomeContent', () => Home, ['config'])

```

### addSlotImport(slotName: string, componentCreator: () => Promise<{ default: React.ComponentType }>, dependenciesNames: string[])


#### Params

- slotName: `string` - Uniqe component name starts from uppercase letter.
- componentCreator: `() => Promise<{ default: React.ComponentType }>` - Function to run import module with default export as component.
- dependenciesNames: `string[]` - List of dependencies from `DependenciesServic`. All dependencies will be pass as props for created Component from `componentCreator`


#### Example


```typescript
const appServiceInstance: AppService = AppService.createAppCreator(dependenciesServiceInstance)
    .addSlotImport('HomeContent', () => import('../path/to/HomeComponent'), ['config'])
    .addSlotImport('NavContent', () => import('../path/to/NavComponent'), ['config']);

```

### createApp(Layout: React.ComponentType, fallback?: React.ReactElement): React.ComponentType


#### Params

- Layout: `React.ComponentType` - Uniqe component name starts from uppercase letter.
- fallback: `React.ReactElement` - Optional Element renderer when Component is downloading or dependencies are resolveing.


#### Example

```typescript
const Layout = ({ slots }) = {
    const { Header, Content } = slots;

    return <div>
        <Header />
        <Content />
    </div>;
}

const App = AppService.createAppCreator(dependenciesServiceInstance)
    .addSlotImport("Header", ...)
    .addSlotImport("Content", ...)
    .createApp(Layout)

```
