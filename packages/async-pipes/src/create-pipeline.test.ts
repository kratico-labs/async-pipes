import { createPipeline } from "./create-pipeline";

describe("createWorkflow", () => {
  it("should create a runable pipeline", async () => {
    const pipeline = createPipeline<string, string>([
      (a: string, next) => {
        return next(a + "1").then((r) => r + "3");
      },

      (a: string, next) => {
        return next(a + "2").then((r) => r + "4");
      },
    ]);

    const result = await pipeline("key", (a) => Promise.resolve(a + "0"));

    expect(result).toBe("key12043");
  });
});
