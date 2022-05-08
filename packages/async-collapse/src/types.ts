export type PromiseFunction<TArg, TResult> = (arg: TArg) => Promise<TResult>;

export type Pipe<TArg, TResult> = (
  arg: TArg,
  next: PromiseFunction<TArg, TResult>
) => Promise<TResult>;

// TODO: add TArgs support
// type Args = any[];
// type PFn<TArgs extends Args, TResult> = (...arg: TArgs) => Promise<TResult>;
