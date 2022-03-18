import { Context, Telegraf } from 'telegraf';

export default async (app: Telegraf) => {
    await app.start((ctx: Context) => {
        ctx.reply('Вы начали работать с FOOWE Courses Bot!').catch((err) => console.log('send err'));
    });
}
