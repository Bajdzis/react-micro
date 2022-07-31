export function Menu ({
    dependencies
}: {
    dependencies: {
        config: {
            language: {
                menuTitle: string;
            }
        }
    }
}) {
    return <div>{dependencies.config.language.menuTitle}</div>;
};
