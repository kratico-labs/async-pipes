import type { PromiseFunction } from "./types";

type Cache<K, V> = {
  get: (k: K) => V | undefined;
  set: (k: K, v: V) => void;
  delete: (k: K) => void;
};

type Configuration<TCacheKey> = {
  cache: Cache<TCacheKey, Promise<unknown>>;
  serialize: (v: unknown) => TCacheKey;
};

export const createDedupePipe =
  <TCacheKey>({ cache, serialize }: Configuration<TCacheKey>) =>
  <TArg, TResult>(
    arg: TArg,
    next: PromiseFunction<TArg, TResult>
  ): Promise<TResult> => {
    const cacheKey = serialize(arg);

    if (cache.get(cacheKey)) {
      return cache.get(cacheKey) as Promise<TResult>;
    }

    const result = next(arg).finally(() => cache.delete(cacheKey));

    cache.set(cacheKey, result);

    return result;
  };

export const dedupePipe = createDedupePipe({
  cache: new Map(),
  serialize: (v) => JSON.stringify(v),
});
