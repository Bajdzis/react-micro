import { DependenciesService } from "@react-micro/dependencies-service";
import React from "react";

interface SlotProps<D extends DependenciesService<any>> {
    dependencies: D
}

export interface LayoutProps< RootSlotKeys extends string,D extends DependenciesService<any> = DependenciesService<any>>{
    slots: {[key in RootSlotKeys]: React.ComponentType<{}>}
    dependencies: D;
}

const sleep = () => {
    return new Promise<void>((resolve) => setTimeout(() => {
        resolve();
    }, 2000))
}

export const createApp = <D extends DependenciesService<any>, SlotKeys extends string>(Layout: React.FC<LayoutProps<SlotKeys,D>>, dependencies: D, components: {[key in SlotKeys]: React.FC<SlotProps<D>> }) =>{
    let slots: {[key in SlotKeys]: React.FC<{}>} = Object.entries(components).reduce<Partial<{[key in SlotKeys]: React.FC<{}>}>>((slots, entry) => {
        const [key, Component] : [SlotKeys, React.FC<SlotProps<D>>] = entry as any;

        const newSlot : React.ComponentType<{}> = React.lazy(async () => {
            console.log(`start load ${key}`);
            await sleep();
            console.log(`end load ${key}`);
            return {
                default: () => <Component dependencies={dependencies} />
            };
        })


        slots[key] = newSlot;

        return slots;

    }, {}) as  {[key in SlotKeys]: React.FC<{}>};

    return () => <Layout dependencies={dependencies} slots={slots}/>;
}
