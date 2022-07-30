type ReturnConstructorType<T extends new (...args: any) => any> = T extends new (...args: any) => infer R ? R : any

export class DependenciesService<Obj extends {[key: string]:any }> {

    private creators: {[key: string]: () => any };
    private values: {[key: string]:any };

    private constructor(){
        this.values = {};
        this.creators = {};
    }

    private getDependencies (): Obj {
        return {...this.values} as Obj
    }

    registerLazyValue<T extends string, T2 extends  (dependency: Obj) => Promise<T3>, T3 extends any>(name: T, creator: T2): DependenciesService<Obj & {[key in T]: T3 }> {

        this.creators[name] = async () => {
            const value = await creator(this.getDependencies());
            this.values[name] = value;
        };
        return this;
    }

    registerLibrary<T extends string, T2 extends (dependency: Obj) => any>(name: T, libraryCreator: T2): DependenciesService<Obj & {[key in T]: ReturnType<T2> }> {
        this.values[name] = () => {
            const value = libraryCreator(this.getDependencies());

            this.values[name] = value;
        }
        return this;
    }

    registerClassService<T extends string, T2 extends new (dependency: Obj) => any>(name: T, ValueClass: T2): DependenciesService<Obj & {[key in T]: ReturnConstructorType<T2> }> {

        this.values[name] = new ValueClass(this.getDependencies());
        return this;
    }

    aliasService<T extends keyof Obj, T2 extends string>(name: T,newName:T2): DependenciesService<Obj & {[key in T2]: Obj[T] }> {
        const values = this.getDependencies();
        this.values[newName] = values[name];

        return this as any;
    }

    async get<T extends keyof Obj>(name: T): Promise<Obj[T]> {
        const values = this.getDependencies();
        if(values[name]) {
            return  values[name];
        }
        return await this.creators[name as any]();
    }

    static createDependenciesService(){

        return new DependenciesService<{}>();
    }
}


