import { createDedupePipe } from "./dedupe-pipe";
import { createPipeline } from "../create-pipeline";

describe("createDedupePipe", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should return a result", async () => {
    const pipeline = createPipeline<string, string>([
      createDedupePipe({
        cache: new Map(),
        serialize: (v) => JSON.stringify(v),
      }),
    ]);

    await expect(pipeline("a", (a) => Promise.resolve(a))).resolves.toEqual(
      "a"
    );
  });

  it("should deduplicate async calls", async () => {
    const pipeline = createPipeline<string, string>([
      createDedupePipe({
        cache: new Map(),
        serialize: (v) => JSON.stringify(v),
      }),
    ]);

    const mock = jest.fn(
      (a: string) =>
        new Promise<string>((resolve) => setTimeout(() => resolve(a), 1000))
    );

    const allWorkflows = Promise.all([
      pipeline("key", mock),
      pipeline("key", mock),
      pipeline("key", mock),
    ]);

    jest.runAllTimers();

    await allWorkflows;

    expect(mock).toBeCalledTimes(1);
  });
});
