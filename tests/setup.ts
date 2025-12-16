import { initSimnet } from "@hirosystems/clarinet-sdk";
import { beforeAll } from "vitest";

let simnet: Awaited<ReturnType<typeof initSimnet>>;

beforeAll(async () => {
  simnet = await initSimnet();
});

export { simnet };
