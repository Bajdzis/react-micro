import { Logger } from "@react-micro/logger-service";

interface Config {
    showMenu: boolean;
    language: {
        menuTitle: string;
    }
}

const sleep = () => {
    return new Promise<void>((resolve) => setTimeout(resolve, 1000))
}

export class ConfigService {
    logger: Logger;

    constructor({logger}: {logger: Logger}) {
        this.logger = logger;
    }

    async get(): Promise<Config> {
        const res = await fetch('/api/config.json');
        await sleep();
        const result = res.json();

        return result;
    }
}
