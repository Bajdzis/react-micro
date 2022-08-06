# React micro

This package is a part of `react-micro`. The package is responsible for dependecies.

## Instal

This package not require any peer dependecies.

```bash
npm i @react-micro/dependencies-service --save
```

## API

### createDependenciesService(): DependenciesService

It is a static function for create new instance app services.

#### params

This function don`t have params.

#### example

```typescript
import { DependenciesService } from "@react-micro/dependencies-service";

const dependenciesServiceInstance: DependenciesService = DependenciesService.createDependenciesService();
```


### registerLazyValue(name: string, creator: () => Promise, dependenciesNames: string[])



#### Params

- name: `string` - Uniqe dependecy name
- creator: `() => Promise` - Function to create dependecy. In first params get object with dependencies from last param.
- dependenciesNames: `string[]` - List of names dependencies. All dependencies will be pass as object to `creator` param.


#### Example

```typescript
const dependenciesServiceInstance: DependenciesService = DependenciesService.createDependenciesService()
    .registerLazyValue('config', async () => ({
        getConfig: () => fetch('/config.json')
    }), [])
    .registerLazyValue('configCache', ({ config }) => config.getConfig(), ['config'])
```

### registerLibrary(name: string, creator: () => any, dependenciesNames: string[])

#### Params

- name: `string` - Uniqe dependecy name
- creator: `() => any` - Function to create dependecy. In first params get object with dependencies from last param.
- dependenciesNames: `string[]` - List of names dependencies. All dependencies will be pass as object to `creator` param.


#### Example

```typescript
const dependenciesServiceInstance: DependenciesService = DependenciesService.createDependenciesService()
    .registerLibrary('config', () => ({
        getConfig: () => fetch('/config.json')
    }), [])
    .registerLazyValue('configCache', ({ config }) => config.getConfig(), ['config'])
```


### registerClassService(name: string, constructor: any, dependenciesNames: string[])

#### Params

- name: `string` - Uniqe dependecy name
- constructor: `any` - Function to create dependecy. In first params get object with dependencies from last param.
- dependenciesNames: `string[]` - List of names dependencies. All dependencies will be pass as object to `creator` param.


#### Example

```typescript
class Config {
    constructor({ logger }) {
        logger.log('Config instance created');
    }
}

const dependenciesServiceInstance: DependenciesService = DependenciesService.createDependenciesService()
    .registerLibrary('logger', console, [])
    .registerClassService('config', Config, ['logger'])
```


### aliasService(currentName: string, newName: string)

#### Params

- currentName: `string` - Uniqe dependecy name
- newName: `string` - Additional uniqe name for dependecy

#### Example

```typescript

const dependenciesServiceInstance: DependenciesService = DependenciesService.createDependenciesService()
    .registerClassService('auth', Auth, [])
    .aliasService('auth', 'authorization')
```


### getDependency(name: string)

#### Params

- name: `string` - Uniqe dependecy name

#### Example

```typescript

const config = await dependenciesServiceInstance.getDependency('config');
```


### getDependency(name: string)

#### Params

- name: `string` - Uniqe dependecy name

#### Example

```typescript
const {config, logger} = await dependenciesServiceInstance.getDependencies(['config', 'logger']);
```

