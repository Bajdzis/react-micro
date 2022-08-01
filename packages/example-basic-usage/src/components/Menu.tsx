
export function Menu ({
    dependencies
}: {
    dependencies: {
        config: {
            language: {
                menuTitle: string;
            }
        },
        pubsubGlobal: {
            emitAction: (type:any, payload:any) => void
        }
    }
}) {

    return <div onClick={() => {
        dependencies.pubsubGlobal.emitAction('clickElement', 'sssss')
    }}>{dependencies.config.language.menuTitle}</div>;
};
