import { Telegraf, session } from 'telegraf';
import { TOKEN } from './config';
import { CommandsController, StartController } from './controllers/index';
import { MyContext } from './interfaces/ctx.interface';
import authMiddleware from './middlewares/auth.middleware';
// @ts-ignore
import telegrafGetChatMembers from 'telegraf-getchatmembers';
import InviteCode from './models/InviteCode';
import { logger } from 'sequelize/types/utils/logger';


export class App {
    app: Telegraf;

    constructor() {
        this.app = new Telegraf<MyContext>(TOKEN);
        this.settings();
        this.middlewares();
        this.controllers().then(() => console.log('Контроллеры загружены'));
    }

    private settings() {

    }


    private middlewares() {
        this.app.use(((ctx, next) => authMiddleware(ctx, next)));
        this.app.use(((ctx, next) => console.log(ctx)));
        this.app.use(telegrafGetChatMembers);
    }

    private async controllers() {
        await StartController(this.app);
        await CommandsController(this.app);
    }

    async launch(): Promise<void> {
        await this.app.launch();
    }

}
