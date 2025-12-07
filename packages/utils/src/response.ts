/* error result for tRPC procedures */
export function resultErr(text: string, status?: number) {
    return { error: text }
}

export function resultOk(text: string) {
    return { message: text }
}

export function internalErr(err?: unknown) {
    return { error: err || 'Internal server error' }
}
