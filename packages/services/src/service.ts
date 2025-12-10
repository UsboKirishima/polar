type CacheKeyType = Record<string, () => string | string>;

export default abstract class PolarService {
    protected readonly CACHE_TTL: number;
    protected readonly CACHE_KEYS: CacheKeyType[];

    public constructor(CACHE_TTL: number, CACHE_KEYS: CacheKeyType[]) {
        this.CACHE_TTL = CACHE_TTL;
        this.CACHE_KEYS = CACHE_KEYS;
    }

    protected handleError(error?: Error) {
        throw new Error(error?.message || 'Unexcepted error.');
    }
}