import { MyContext } from '../interfaces/ctx.interface';
import Account from '../models/Account';

export default async (ctx: MyContext, next: Function) => {
    // @ts-ignore
    const account = await Account.getAccountsByTelegram(ctx.message.from.id);

    if (account) {
        if (account.rights === 'admin') {
            return next();
        } else return ctx.reply('🔐 У вас нет доступа к этой команде!');
    }
}
