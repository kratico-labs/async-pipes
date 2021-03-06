import { createPipeline } from "../create-pipeline";
import { createSWRPipe } from "./swr-pipe";

describe("createSWRPipe", () => {
  it("should return a result", async () => {
    const pipeline = createPipeline<string, string>([
      createSWRPipe({
        cache: new Map(),
        serialize: (v) => JSON.stringify(v),
        cacheTime: 5000,
        staleTime: 5000,
      }),
    ]);

    await expect(pipeline("a", (a) => Promise.resolve(a))).resolves.toEqual(
      "a"
    );
  });

  it("should cached async calls", async () => {
    const nowMock = jest.spyOn(global.Date, "now");

    nowMock.mockImplementation(() => 0);

    const pipeline = createPipeline<string, string>([
      createSWRPipe({
        cache: new Map(),
        serialize: (v) => JSON.stringify(v),
        cacheTime: 5000,
        staleTime: 5000,
      }),
    ]);

    const mock = jest.fn((a: string) => Promise.resolve(a));

    // cache result
    await pipeline("key", mock);
    // serve cached result
    await pipeline("key", mock);

    expect(mock).toBeCalledTimes(1);

    // expire the cache
    nowMock.mockImplementation(() => 7000);

    // cache a new result
    await pipeline("key", mock);
    // serve new cached result
    await pipeline("key", mock);

    expect(mock).toBeCalledTimes(2);
  });
});
