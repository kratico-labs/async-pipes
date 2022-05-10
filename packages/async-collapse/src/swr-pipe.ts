import type { PromiseFunction } from "./types";

type CacheEntry<V> = {
  timestamp: number;
  value: V;
};

type Cache<K, V> = {
  get: (k: K) => CacheEntry<V> | undefined;
  set: (k: K, v: CacheEntry<V>) => void;
  delete: (k: K) => void;
};

type Configuration<TCacheKey> = {
  cache: Cache<TCacheKey, Promise<unknown>>;
  serialize: (v: unknown) => TCacheKey;
  cacheTime: number;
  staleTime: number;
};

export const createSWRPipe =
  <TCacheKey>({ cache, serialize, cacheTime }: Configuration<TCacheKey>) =>
  <TArg, TResult>(
    arg: TArg,
    next: PromiseFunction<TArg, TResult>
  ): Promise<TResult> => {
    const cacheKey = serialize(arg);
    const cacheValue = cache.get(cacheKey);

    if (!cacheValue) {
      const result = next(arg);

      void result.then(() => {
        cache.set(cacheKey, { value: result, timestamp: Date.now() });
      });

      return result;
    }

    const now = Date.now();

    // TODO: check if the cache entry is stale
    // - delete the cache entry
    // - block on result

    // checks if the cache entry has expired
    if (now - cacheValue.timestamp > cacheTime) {
      const result = next(arg);

      void result.then(() => {
        cache.set(cacheKey, { value: result, timestamp: Date.now() });
      });
    }

    return cacheValue.value as Promise<TResult>;
  };
