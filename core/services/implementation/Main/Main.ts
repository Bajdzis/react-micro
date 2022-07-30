import { NullObjectLogger } from "../Looger/NullObjectLogger";
import { PubSub } from "../PubSub/PubSub";

type ReturnConstructorType<T extends new (...args: any) => any> = T extends new (...args: any) => infer R ? R : any

class MainServices<Obj extends {[key: string]:any } = {}> {

    // @ts-ignore
    private values:Obj = {};

    constructor() {

    }

    registerService<T extends string, T2 extends new (depts: Obj) => any>(name: T, value: T2): MainServices<Obj & {[key in T]: ReturnConstructorType<T2> }> {
        // @ts-ignore
        this.values[name] = new value({...this.values});
        return this;
    }

    aliasService<T extends keyof Obj, T2 extends string>(name: T,newName:T2): MainServices<Obj & {[key in T2]: Obj[T] }> {
        // @ts-ignore
        this.values[newName] = this.values[name];
        // @ts-ignore
        return this;
    }

    get<T extends keyof Obj>(name: T): Obj[T] {
        return this.values[name];
    }
}


const abc = new MainServices();

const aaa = abc.registerService('null-logger', NullObjectLogger).aliasService('null-logger', 'logger').registerService('ggg',PubSub);

aaa.get('ggg').emit('AAA')
