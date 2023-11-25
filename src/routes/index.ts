import { Application } from "express";
import authRouter from "./auth.routes";
import productRouter from "./product.routes";

function routeHandler(app: Application) {
    app
        .use('/auth', authRouter)
        .use('/product', productRouter)
}

export default routeHandler