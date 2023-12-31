import { Router } from "express";
import authRouter from "./auth.routes";
import productRouter from "./product.routes";

const router = Router()

router
    .use('/auth', authRouter)
    .use('/product', productRouter)

export default router