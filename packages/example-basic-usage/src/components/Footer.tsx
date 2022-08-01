import { useEffect } from "react";


export function Footer ({
    dependencies
}: {
    dependencies: {
        pubsubGlobalSubscriber: (type:'openPage' | 'clickElement', subscriber: (action: any) => void) => () =>  void
    }
})  {

    useEffect(() => {
        return dependencies.pubsubGlobalSubscriber('clickElement', (action) => {console.log('clickElement', action)})
    });

    return <div>Footer</div>;
};
