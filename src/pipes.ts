import type { Pipe, PromiseFunction } from "./types";

export const createWorkflow = <T, U>(
  pipes: Pipe<T, U>[]
): ((arg: T, fn: PromiseFunction<T, U>) => Promise<U>) => {
  const runPipes = <T, U>(
    arg: T,
    fn: PromiseFunction<T, U>,
    pipes: Pipe<T, U>[]
  ): Promise<U> => {
    if (pipes.length === 0) {
      return fn(arg);
    }

    const [head, ...tail] = pipes;

    return head(arg, (arg) => runPipes(arg, fn, tail));
  };

  return (arg, fn) => runPipes(arg, fn, pipes);
};
