// @vitest-environment node

import { describe, expect, it } from "vitest";
import { MarketContractService, initializeMarketSDK } from "../sdk/src";

describe("sdk defaults", () => {
  it("targets the V3 contract by default", () => {
    const service = new MarketContractService("SP123", true);

    expect((service as any).contractName).toBe("btc-prediction-market-v5");
  });

  it("lets the factory override the contract name when needed", () => {
    const service = initializeMarketSDK("SP123", false, "btc-prediction-market-v2");

    expect((service as any).contractName).toBe("btc-prediction-market-v2");
  });
});

// [feat/multi-chain-support] commit 8/10: augment test layer – 1776638306095657730
