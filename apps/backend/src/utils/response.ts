import type { Response } from 'express';

export function responseError(res: Response, status: number, text: string): void {
    res.status(status).json({ message: text });
}

export function responseSuccess(res: Response, content: string | object): void {
    res.status(200).json(
        (typeof content === 'string')
            ? { message: content }
            : content,
    );
}
