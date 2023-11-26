import { NextFunction, Response, Request, Router } from "express";

const router = Router()

router
    .post('/login', (req: Request, res: Response, next: NextFunction) => {
        res.status(200).send({
            status: 'success',
            message: 'Welcome to the API'
        })
    })

export default router