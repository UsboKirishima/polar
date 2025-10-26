/* error result for tRPC procedures */
export const resultErr = (text: string, status?: number) => {
    return { error: text };
};

export const resultOk = (text: string) => {
    return { message: text }
};

export const internalErr = (err?: unknown) => {
    return { error: err || 'Internal server error' };
};