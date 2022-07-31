import { DependenciesService, DependenciesServiceKey, DependenciesServiceObj } from "@react-micro/dependencies-service";
import React from "react";

export interface LayoutProps<RootSlotKeys extends string> {
    slots: {[key in RootSlotKeys]: React.ComponentType<{}>}
}

export class AppService<SlotKeys extends string, D extends DependenciesService<any,any>> {
    private dependenciesService: D;
    private slots: {[key in SlotKeys]: React.ComponentType<{}>};

    private constructor(dependenciesService: D, slots: {[key in SlotKeys]: React.ComponentType<{}>}){
        this.slots = slots;
        this.dependenciesService = dependenciesService;
    }

    addSlot<
        SlotKey extends string,
        DKey extends DependenciesServiceKey<D>,
        Obj = DependenciesServiceObj<D>,
        Component = React.ComponentType< {
            dependencies: Pick<Obj, DKey>;
        } >
    >(key: SlotKey, componentCreator: () => Promise<Component> | Component, depts: DKey[]) {

        const newSlot: React.ComponentType<{}> = React.lazy(async () => {
            const dependencies = await this.dependenciesService.getDependencies(depts);
            const Comp = await componentCreator();

            return {
                // @ts-ignore
                default: () => <Comp dependencies={dependencies} />
            };
        })

        const newSlots = {
            ...this.slots,
            [key]: newSlot
        } as {[key in SlotKeys | SlotKey]: React.ComponentType<{}>};

        return new AppService<SlotKeys | SlotKey, D>(this.dependenciesService, newSlots);
    }

    createApp(Layout: React.FC<LayoutProps<SlotKeys>>) {
        return () => <Layout slots={this.slots}/>;
    }

    static createDependenciesService<D extends DependenciesService<any, any>>(dependenciesService: D){
        return new AppService<never,D>(dependenciesService,{});
    }
}
