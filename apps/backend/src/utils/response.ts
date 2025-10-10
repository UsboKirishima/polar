import { Response } from "express";

export const responseError =
    (res: Response, status: number, text: string): void => {
        res.status(status).json({ message: text });
    }

export const responseSuccess =
    (res: Response, content: string | object): void => {
        res.status(200).json(
            (typeof content === 'string')
                ? { message: content }
                : content);
    }

/* error result for tRPC procedures */
export const resultErr = (text: string, status?: number) => { message: text };
export const resultOk = (text: string) => { message: text };