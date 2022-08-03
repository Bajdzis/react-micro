import { PubSubScope } from "@react-micro/pub-sub";

export function Menu ({
    dependencies
}: {
    dependencies: {
        config: {
            language: {
                menuTitle: string;
            }
        },
        pubsubGlobal: PubSubScope<{
            clickElement: {
                element:'logo'|'nav';
            }
        }>
    }
}) {

    return <div onClick={() => {
        dependencies.pubsubGlobal.emitAction('clickElement', {
            element:'nav'
        })
    }}>{dependencies.config.language.menuTitle}</div>;
};
