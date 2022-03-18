import { Telegraf } from 'telegraf';

// @ts-ignore
import telegrafGetChatMembers from 'telegraf-getchatmembers';
import adminMiddleware from '../middlewares/admin.middleware';
import InviteCode from '../models/InviteCode';
import { Rights } from '../enums/rights.enum';
import Account from '../models/Account';
import userMiddleware from '../middlewares/user.middleware';

export default async (app: Telegraf) => {
    app.command('/test', (ctx) => {
        ctx.replyWithChatAction('typing');
        console.log(ctx.chat);

        setTimeout(() => {
            ctx.reply('This is /test command');
        }, 5000);
    });

    app.command('/getUsers', ctx => {
        ctx.deleteMessage();
        ctx.replyWithPhoto('https://sun9-55.userapi.com/impf/7mhuCUlUOD4LUY0DlNjPrLU6rIL3y5x1XPC1BA/7NIDZrJ72C8.jpg?size=1500x1500&quality=96&sign=664d2c91957ccb2a04111713ff13f8f0&type=album');

        //@ts-ignore
        console.log(ctx.getChatMembers(ctx.chat.id));
    });

    // Admin command

    app.command('/createInviteCode', adminMiddleware, async ctx => {
        await ctx.replyWithChatAction('typing');

        const code = Math.floor(Math.random() * (99999999 - 10000000)) + 10000000;
        const inviteCode = await InviteCode.createCode({inviteCode: code.toString(), rights: Rights.USER});

        if (inviteCode) {
            return ctx.replyWithHTML(`✅ Код успешно создан!\n➡ Пригласительный код: <b>` + inviteCode.inviteCode + `</b>`);
        } else return ctx.reply('❌ Присоздании кода произошла ошибка!');
    });

    app.command('/say', adminMiddleware, async ctx => {
        await ctx.replyWithChatAction('typing');

        const msg = ctx.message.text.toString().substring(5);

        if (msg.length <= 0) {
            return ctx.reply('⚠️ Вы не ввели сообщение!')
        }

        return await ctx.telegram.sendMessage(-1001556225791, `📢 ${msg}`);
    });

    // Admin command

    // User command

    app.command('/activateLauncher', userMiddleware, async ctx => {
        await ctx.replyWithChatAction('typing');

        const hwid_key = ctx.message.text.toString().substring(18);

        if (hwid_key.length <= 0) {
            return ctx.reply('⚠️ Вы не ввели HWID!')
        }

        // @ts-ignore
        const account = await Account.getAccountsByTelegram(ctx.message.from.id);

        if (account) {
            try {
                await Account.updateHwidByTelegram(account.telegram, hwid_key);
            } catch (e) {
                return ctx.reply('❌ Произошла неизвестаня ошибка, обратитесь к @artik19129')
            }

            return ctx.reply('✅ Ваш HWID успешно активирован!')
        }
    });

    // User command

    /*app.on('text', async (ctx) => {
        console.log(ctx);
        console.log(ctx.update.message.from);

        let mess = await app.telegram.sendMessage(ctx.update.message.chat.id, '123...');

        setTimeout(() => {
            app.telegram.editMessageText(mess.chat.id, mess.message_id, undefined, '456...');
        }, 5000);
    });*/
}
