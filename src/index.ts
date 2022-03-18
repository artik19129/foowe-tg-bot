import { App } from './app'

async function main() {
    const app = new App();
    await app.launch();
}

main().then(() => console.log('Бот запущен!'));
