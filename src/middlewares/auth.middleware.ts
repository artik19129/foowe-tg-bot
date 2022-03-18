import { MyContext } from '../interfaces/ctx.interface';
import Account from '../models/Account';
import InviteCode from '../models/InviteCode';

export default async (ctx: MyContext, next: Function) => {

    // @ts-ignore
    if (ctx.chat.type === 'private') {
        await ctx.replyWithChatAction('typing');

        // @ts-ignore
        const account = await Account.getAccountsByTelegram(ctx.message.from.id);

        if (!account) {
            let regexp = new RegExp('^[0-9]+$');
            // @ts-ignore
            let test = regexp.test(ctx.message.text.toString());

            if (test) {
                // @ts-ignore
                const code = await InviteCode.checkCode(ctx.message.text.toString());

                if (code) {

                    const account = await Account.createAccount({
                        // @ts-ignore
                        login: ctx.message.from.username || ctx.message.from.first_name,
                        password: 'none',
                        email: 'none',
                        // @ts-ignore
                        telegram: ctx.message.from.id,
                        rights: code.rights
                    });
                    await InviteCode.activateCode(code.id, account.telegram);

                    // @ts-ignore
                    await ctx.telegram.sendMessage(-1001556225791, `📢 Поздравляем, теперь ${ctx.message.from.first_name} (@${ctx.message.from.username}) зарегестрирован в системе!`)

                    // await ctx.deleteMessage(); //TODO: Надо подумать, нужно ли это
                    await ctx.reply('✅ Аккаунт успешно был создан!\n🔓 Теперь у вас есть доступ ко всем функциям бота.');
                    return next();
                } else {
                    return ctx.reply('❌ Пригласительный код не найден в базе данных.');
                }
            } else return ctx.reply('ℹ️ Для получения доступа к функциям бота, Вам нужно ввести пригласительный код.\n🔐 Введите код:');
        } else return next();
    }
    return next();
}
