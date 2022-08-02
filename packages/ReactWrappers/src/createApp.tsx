import { DependenciesService, DependenciesServiceKey, DependenciesServiceObj } from "@react-micro/dependencies-service";
import React from "react";

export interface LayoutProps<RootSlotKeys extends string> {
    slots: {[key in RootSlotKeys]: React.ComponentType<{}>}
}

export class AppService<SlotKeys extends string, D extends DependenciesService<any>> {
    private dependenciesService: D;
    private slots: {[key in SlotKeys]: React.ComponentType<{}>};

    private constructor(dependenciesService: D, slots: {[key in SlotKeys]: React.ComponentType<{}>}){
        this.slots = slots;
        this.dependenciesService = dependenciesService;
    }

    addSlotImport<
        SlotKey extends string,
        DKey extends DependenciesServiceKey<D>[],
        DependenciesComponent extends Pick<DependenciesServiceObj<D>, DKey[number]>,
        Component extends React.ComponentType< {
            dependencies: DependenciesComponent;
        } >
    >(key: SlotKey, componentCreator: () => Promise<{default :Component}>, depts: DKey) {

        return this.addSlot<SlotKey,DKey,DependenciesComponent,Component>(key, async () => {
            const module = await componentCreator();
            return module.default;
        }, depts)
    }

    addSlot<
        SlotKey extends string,
        DKey extends DependenciesServiceKey<D>[],
        DependenciesComponent extends Pick<DependenciesServiceObj<D>, DKey[number]>,
        Component extends React.ComponentType< {
            dependencies: DependenciesComponent;
        } >
    >(key: SlotKey, componentCreator: () => Component | Promise<Component>, depts: DKey) {

        const newSlot: React.ComponentType<{}> = React.lazy(async () => {
            const [dependencies, Comp] = await Promise.all([
                this.dependenciesService.getDependencies(depts),
                componentCreator()
            ]);

            return {
                //@ts-ignore
                default: () => <Comp dependencies={dependencies} />
            };
        })

        const newSlots = {
            ...this.slots,
            [key]: newSlot
        } as {[key in SlotKeys | SlotKey]: React.ComponentType<{}>};

        return new AppService<SlotKeys | SlotKey, D>(this.dependenciesService, newSlots);
    }

    createApp<Slots extends SlotKeys>(Layout: React.FC<LayoutProps<Slots>>) {
        return () => <Layout slots={this.slots}/>;
    }

    static createAppCreator<D extends DependenciesService<any>>(dependenciesService: D){
        return new AppService<never,D>(dependenciesService,{});
    }
}
