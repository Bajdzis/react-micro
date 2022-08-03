import { useEffect } from "react";
import {PubSubScope} from "@react-micro/pub-sub";


export function Footer ({
    dependencies
}: {
    dependencies: {
        pubsubGlobalSubscriber: PubSubScope<{
            clickElement: {
                element:'logo'|'nav';
            },
        }>['subscribeAction']
    }
})  {

    useEffect(() => {
        return dependencies.pubsubGlobalSubscriber('clickElement', (action) => {console.log('clickElement', action)})
    });

    return <div>Footer</div>;
};
