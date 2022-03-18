import { Context, Scenes } from 'telegraf';

interface MySceneSession extends Scenes.SceneSessionData {
    // will be available under `ctx.scene.session.mySceneSessionProp`
    mySceneSessionProp: number
}

interface MySession extends Scenes.SceneSession<MySceneSession> {
    // will be available under `ctx.session.mySessionProp`
    mySessionProp: number
}

export interface MyContext extends Context {
    // will be available under `ctx.myContextProp`
    myContextProp?: string

    // declare session type
    session?: MySession
    // declare scene type
    scene?: Scenes.SceneContextScene<MyContext, MySceneSession>
}
