type ReturnConstructorType<T extends new (...args: any) => any> = T extends (new (...args: any) => infer R) ? R : any

type ReturnPromiseType<T extends (...args: any) => Promise<any>> = T extends (...args: any) => Promise<infer R> ? R : any

type Creators<T> = { [P in keyof T]: () => Promise<T[P]>; };

type DuringCreators<T> = { [P in keyof T]?: Promise<T[P]>; };

export type DependenciesServiceObj<T extends DependenciesService<any,any>> =  T extends DependenciesService<any,infer R> ? R : any;

export type DependenciesServiceKey<T extends DependenciesService<any,any>> =  T extends DependenciesService<infer R,any> ? R : any;

export class DependenciesService<Keys extends string, Obj extends {[key in Keys]:any}> {

    private creators: Creators<Obj>;
    private during: DuringCreators<Obj>;
    private values: Partial<Obj>;

    private constructor(values: Partial<Obj>, creators: Creators<Obj>, during: DuringCreators<Obj>){
        this.values = values;
        this.creators = creators;
        this.during = during;
    }

    public async getDependency<T extends Keys>(key: T): Promise<Obj[T]> {
        const value = this.values[key];
        if(value !== undefined) {
            return value as Obj[T];
        }

        const dur = this.during[key];
        if(value !== undefined) {
            return dur as Promise<Obj[T]>;
        }

        const createdValue = this.creators[key]();
        this.during[key] = createdValue;
        createdValue.then(val => {
            this.values[key] = val;
        })
        return createdValue
    }

    public async getDependencies <T extends Keys, Result = Pick<Obj,T>>(keys: T[]): Promise<Result>  {
        const arr = await Promise.all(keys.map((key) => {
            return this.getDependency(key).then(data => [key,data] as [T, Obj[T]]);
        }));

        const obj = arr.reduce<
            Partial<Result>
        >((acc, [key, data]) => {
            // @ts-ignore
            acc[key] = data;
            return acc;
        }, {});

        return obj as Result;
    }

    registerLazyValue<
        DependencyKeys extends Keys[],
        T extends string,
        T2 extends (dependency: Pick<Obj,DependencyKeys[number]>) => Promise<any>,
    T3 extends ReturnPromiseType<T2>
    >(name: T, creator: T2, depts: DependencyKeys) {
        const newCreator = {
            [name]: async () => {
                const aaa = await this.getDependencies(depts);
                const value = await creator(aaa);
                return value;
            }
        } as {[key in T]: () => Promise<T3> }

        return new DependenciesService<Keys | T, Obj & {[key in T]: T3 } >({}, {
            ...this.creators,
            ...newCreator
        }, this.during as DuringCreators<Obj & {[key in T]: T3 }>);
    }

    registerLibrary<T extends string, T2 extends () => any, T3 = ReturnType<T2>>(name: T, libraryCreator: T2) {

        const newCreator = {
            [name]: async () => {
                return libraryCreator();
            }
        } as Creators<{[key in T]: T3 }>

        const current = {
            ...this.creators,
            ...newCreator
        } as Creators< Obj & {[key in T]: T3 }>

        return new DependenciesService<Keys | T, Obj & {[key in T]: T3 } >({}, current,this.during  as DuringCreators<Obj & {[key in T]: T3 }>);
    }

    registerClassService<
        DependencyKeys extends Keys[],
        T extends string,
        T2 extends new (dependency: Pick<Obj,DependencyKeys[number]>) => any,
    >(name: T, ValueClass: T2, depts: DependencyKeys) {

        const newCreator = {
            [name]: async () => {
                const aaa = await this.getDependencies(depts);
                return new ValueClass(aaa);
            }
        } as {[key in T]: () => Promise<ReturnConstructorType<T2>> }

        return new DependenciesService<Keys | T, Obj & {[key in T]: ReturnConstructorType<T2> }>({}, {
            ...this.creators,
            ...newCreator
        },this.during  as DuringCreators<Obj & {[key in T]: ReturnConstructorType<T2> }>);
    }

    aliasService<T extends Keys, T2 extends string>(name: T,newName:T2): DependenciesService<Keys | T2, Obj & {[key in T2]: Obj[T] }> {

        const newCreator = {
            [newName]: this.creators[name]
        } as Creators<{[key in T2]: Obj[T] }>

        const values = {
            ...this.values,
            [newName]: this.values[name]
        } as Partial<Obj & {[key in T2]: Obj[T] }>;

        const current = {
            ...this.creators,
            ...newCreator
        } as Creators< Obj & {[key in T2]: Obj[T] }>

        return new DependenciesService<Keys | T2, Obj & {[key in T2]: Obj[T] }>(values, current, this.during as DuringCreators<Obj & {[key in T2]: Obj[T] }>);
    }

    static createDependenciesService(){
        return new DependenciesService<never, {}>({},{},{});
    }
}
