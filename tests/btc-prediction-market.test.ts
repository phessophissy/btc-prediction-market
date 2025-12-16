import { describe, it, expect, beforeEach } from "vitest";
import { initSimnet } from "@hirosystems/clarinet-sdk";
import { Cl, cvToValue } from "@stacks/transactions";

describe("Bitcoin Prediction Market Tests", () => {
  let simnet: Awaited<ReturnType<typeof initSimnet>>;
  let deployer: string;
  let wallet1: string;
  let wallet2: string;
  let wallet3: string;

  const CONTRACT_NAME = "btc-prediction-market";
  const TOKEN_CONTRACT = "prediction-token";
  const MARKET_CREATION_FEE = 5000000n; // 5 STX
  const MIN_BET = 1000000n; // 1 STX

  beforeEach(async () => {
    simnet = await initSimnet();
    const accounts = simnet.getAccounts();
    deployer = accounts.get("deployer")!;
    wallet1 = accounts.get("wallet_1")!;
    wallet2 = accounts.get("wallet_2")!;
    wallet3 = accounts.get("wallet_3")!;
  });

  describe("Market Creation", () => {
    it("should create a binary market successfully", async () => {
      const currentBurnHeight = simnet.burnBlockHeight;
      const settlementHeight = currentBurnHeight + 100;

      const result = simnet.callPublicFn(
        CONTRACT_NAME,
        "create-binary-market",
        [
          Cl.stringUtf8("Will BTC hash be even at block " + settlementHeight + "?"),
          Cl.stringUtf8("Predict whether the Bitcoin block hash will be even or odd"),
          Cl.uint(settlementHeight),
        ],
        wallet1
      );

      expect(result.result).toBeOk(Cl.uint(0)); // First market ID is 0
    });

    it("should charge market creation fee", async () => {
      const initialBalance = simnet.getAssetsMap().get("STX")?.get(wallet1) || 0n;
      const settlementHeight = simnet.burnBlockHeight + 100;

      simnet.callPublicFn(
        CONTRACT_NAME,
        "create-binary-market",
        [
          Cl.stringUtf8("Test Market"),
          Cl.stringUtf8("Test Description"),
          Cl.uint(settlementHeight),
        ],
        wallet1
      );

      const finalBalance = simnet.getAssetsMap().get("STX")?.get(wallet1) || 0n;
      expect(initialBalance - finalBalance).toBe(MARKET_CREATION_FEE);
    });

    it("should create multi-outcome market", async () => {
      const settlementHeight = simnet.burnBlockHeight + 100;

      const result = simnet.callPublicFn(
        CONTRACT_NAME,
        "create-multi-market",
        [
          Cl.stringUtf8("4-outcome prediction"),
          Cl.stringUtf8("Predict which quarter of hash range"),
          Cl.uint(settlementHeight),
          Cl.bool(true),  // outcome A
          Cl.bool(true),  // outcome B
          Cl.bool(true),  // outcome C
          Cl.bool(true),  // outcome D
        ],
        wallet1
      );

      expect(result.result).toBeOk(Cl.uint(0));
    });

    it("should reject market with invalid settlement height", async () => {
      const settlementHeight = simnet.burnBlockHeight + 2; // Too soon

      const result = simnet.callPublicFn(
        CONTRACT_NAME,
        "create-binary-market",
        [
          Cl.stringUtf8("Invalid Market"),
          Cl.stringUtf8("Settlement too soon"),
          Cl.uint(settlementHeight),
        ],
        wallet1
      );

      expect(result.result).toBeErr(Cl.uint(1011)); // ERR-INVALID-MARKET-PARAMS
    });
  });

  describe("Betting", () => {
    beforeEach(async () => {
      // Create a market first
      const settlementHeight = simnet.burnBlockHeight + 100;
      simnet.callPublicFn(
        CONTRACT_NAME,
        "create-binary-market",
        [
          Cl.stringUtf8("Test Market"),
          Cl.stringUtf8("Test Description"),
          Cl.uint(settlementHeight),
        ],
        deployer
      );
    });

    it("should place bet on outcome A", async () => {
      const betAmount = 10000000n; // 10 STX

      const result = simnet.callPublicFn(
        CONTRACT_NAME,
        "bet-outcome-a",
        [Cl.uint(0), Cl.uint(betAmount)],
        wallet1
      );

      expect(result.result).toBeOk(
        Cl.tuple({
          "market-id": Cl.uint(0),
          outcome: Cl.uint(1), // OUTCOME-A
          amount: Cl.uint(betAmount),
        })
      );
    });

    it("should place bet on outcome B", async () => {
      const betAmount = 15000000n; // 15 STX

      const result = simnet.callPublicFn(
        CONTRACT_NAME,
        "bet-outcome-b",
        [Cl.uint(0), Cl.uint(betAmount)],
        wallet2
      );

      expect(result.result).toBeOk(
        Cl.tuple({
          "market-id": Cl.uint(0),
          outcome: Cl.uint(2), // OUTCOME-B
          amount: Cl.uint(betAmount),
        })
      );
    });

    it("should reject bet below minimum", async () => {
      const result = simnet.callPublicFn(
        CONTRACT_NAME,
        "bet-outcome-a",
        [Cl.uint(0), Cl.uint(100)], // Way below minimum
        wallet1
      );

      expect(result.result).toBeErr(Cl.uint(1007)); // ERR-BET-TOO-SMALL
    });

    it("should update market pools correctly", async () => {
      // Place bets
      simnet.callPublicFn(
        CONTRACT_NAME,
        "bet-outcome-a",
        [Cl.uint(0), Cl.uint(10000000n)],
        wallet1
      );

      simnet.callPublicFn(
        CONTRACT_NAME,
        "bet-outcome-b",
        [Cl.uint(0), Cl.uint(20000000n)],
        wallet2
      );

      // Check market state
      const marketResult = simnet.callReadOnlyFn(
        CONTRACT_NAME,
        "get-market",
        [Cl.uint(0)],
        deployer
      );

      const market = cvToValue(marketResult.result);
      expect(market.value["total-pool"].value).toBe(30000000n);
      expect(market.value["outcome-a-pool"].value).toBe(10000000n);
      expect(market.value["outcome-b-pool"].value).toBe(20000000n);
    });

    it("should track user positions", async () => {
      simnet.callPublicFn(
        CONTRACT_NAME,
        "bet-outcome-a",
        [Cl.uint(0), Cl.uint(10000000n)],
        wallet1
      );

      const positionResult = simnet.callReadOnlyFn(
        CONTRACT_NAME,
        "get-user-position",
        [Cl.uint(0), Cl.principal(wallet1)],
        deployer
      );

      const position = cvToValue(positionResult.result);
      expect(position.value["outcome-a-amount"].value).toBe(10000000n);
      expect(position.value["total-invested"].value).toBe(10000000n);
    });
  });

  describe("Clarity 4 Features", () => {
    it("should get current burn height using tenure-height", async () => {
      const result = simnet.callReadOnlyFn(
        CONTRACT_NAME,
        "get-current-burn-height",
        [],
        deployer
      );

      expect(result.result).toBeUint(simnet.burnBlockHeight);
    });

    it("should check bitwise outcome packing", async () => {
      // Test pack-outcomes function
      const result = simnet.callReadOnlyFn(
        CONTRACT_NAME,
        "pack-outcomes",
        [Cl.bool(true), Cl.bool(true), Cl.bool(false), Cl.bool(false)],
        deployer
      );

      expect(result.result).toBeUint(3); // 0011 binary = 3
    });

    it("should check if outcome is enabled using bitwise AND", async () => {
      const result = simnet.callReadOnlyFn(
        CONTRACT_NAME,
        "is-outcome-enabled",
        [Cl.uint(3), Cl.uint(1)], // packed = 3, checking OUTCOME-A (1)
        deployer
      );

      expect(result.result).toBeBool(true);
    });

    it("should count enabled outcomes correctly", async () => {
      const result = simnet.callReadOnlyFn(
        CONTRACT_NAME,
        "count-enabled-outcomes",
        [Cl.uint(15)], // All 4 outcomes enabled (1111)
        deployer
      );

      expect(result.result).toBeUint(4);
    });

    it("should check premium user status using stx-account", async () => {
      const result = simnet.callReadOnlyFn(
        CONTRACT_NAME,
        "is-premium-user",
        [Cl.principal(wallet1)],
        deployer
      );

      // wallet1 has no locked STX in test environment
      expect(result.result).toBeBool(false);
    });
  });

  describe("Market Odds Calculation", () => {
    beforeEach(async () => {
      const settlementHeight = simnet.burnBlockHeight + 100;
      simnet.callPublicFn(
        CONTRACT_NAME,
        "create-binary-market",
        [
          Cl.stringUtf8("Odds Test Market"),
          Cl.stringUtf8("Testing odds calculation"),
          Cl.uint(settlementHeight),
        ],
        deployer
      );

      // Place some bets
      simnet.callPublicFn(
        CONTRACT_NAME,
        "bet-outcome-a",
        [Cl.uint(0), Cl.uint(30000000n)], // 30 STX
        wallet1
      );

      simnet.callPublicFn(
        CONTRACT_NAME,
        "bet-outcome-b",
        [Cl.uint(0), Cl.uint(10000000n)], // 10 STX
        wallet2
      );
    });

    it("should calculate market odds", async () => {
      const result = simnet.callReadOnlyFn(
        CONTRACT_NAME,
        "get-market-odds",
        [Cl.uint(0)],
        deployer
      );

      const odds = cvToValue(result.result);
      expect(odds.value["total-pool"].value).toBe(40000000n);
      // Outcome A: 40M/30M * 10000 = 13333 (1.33x)
      // Outcome B: 40M/10M * 10000 = 40000 (4x)
    });

    it("should calculate potential payout", async () => {
      const result = simnet.callReadOnlyFn(
        CONTRACT_NAME,
        "calculate-potential-payout",
        [Cl.uint(0), Cl.uint(2), Cl.uint(10000000n)], // Bet 10 STX on outcome B
        deployer
      );

      const payout = cvToValue(result.result);
      // With 30M on A, 20M on B (after this bet), total = 50M
      // Gross payout = 10M * 50M / 20M = 25M
      expect(payout.value["gross-payout"].value).toBeGreaterThan(0n);
    });
  });

  describe("Time-based Functions", () => {
    it("should get blocks until settlement", async () => {
      const settlementHeight = simnet.burnBlockHeight + 50;
      
      simnet.callPublicFn(
        CONTRACT_NAME,
        "create-binary-market",
        [
          Cl.stringUtf8("Time Test"),
          Cl.stringUtf8("Description"),
          Cl.uint(settlementHeight),
        ],
        deployer
      );

      const result = simnet.callReadOnlyFn(
        CONTRACT_NAME,
        "get-blocks-until-settlement",
        [Cl.uint(0)],
        deployer
      );

      const blocks = cvToValue(result.result);
      expect(blocks.value).toBe(BigInt(50));
    });

    it("should check if market is settleable", async () => {
      const settlementHeight = simnet.burnBlockHeight + 10;
      
      simnet.callPublicFn(
        CONTRACT_NAME,
        "create-binary-market",
        [
          Cl.stringUtf8("Settleable Test"),
          Cl.stringUtf8("Description"),
          Cl.uint(settlementHeight),
        ],
        deployer
      );

      // Market is not settleable yet
      const result = simnet.callReadOnlyFn(
        CONTRACT_NAME,
        "is-market-settleable",
        [Cl.uint(0)],
        deployer
      );

      expect(result.result).toBeSome(Cl.bool(false));
    });
  });

  describe("User Statistics", () => {
    it("should track markets created", async () => {
      const settlementHeight = simnet.burnBlockHeight + 100;
      
      simnet.callPublicFn(
        CONTRACT_NAME,
        "create-binary-market",
        [
          Cl.stringUtf8("Market 1"),
          Cl.stringUtf8("Description"),
          Cl.uint(settlementHeight),
        ],
        wallet1
      );

      simnet.callPublicFn(
        CONTRACT_NAME,
        "create-binary-market",
        [
          Cl.stringUtf8("Market 2"),
          Cl.stringUtf8("Description"),
          Cl.uint(settlementHeight + 100),
        ],
        wallet1
      );

      const result = simnet.callReadOnlyFn(
        CONTRACT_NAME,
        "get-user-stats",
        [Cl.principal(wallet1)],
        deployer
      );

      const stats = cvToValue(result.result);
      expect(stats.value["markets-created"].value).toBe(2n);
    });

    it("should track total bets placed", async () => {
      const settlementHeight = simnet.burnBlockHeight + 100;
      
      simnet.callPublicFn(
        CONTRACT_NAME,
        "create-binary-market",
        [
          Cl.stringUtf8("Bet Tracking Test"),
          Cl.stringUtf8("Description"),
          Cl.uint(settlementHeight),
        ],
        deployer
      );

      simnet.callPublicFn(
        CONTRACT_NAME,
        "bet-outcome-a",
        [Cl.uint(0), Cl.uint(5000000n)],
        wallet1
      );

      simnet.callPublicFn(
        CONTRACT_NAME,
        "bet-outcome-b",
        [Cl.uint(0), Cl.uint(10000000n)],
        wallet1
      );

      const result = simnet.callReadOnlyFn(
        CONTRACT_NAME,
        "get-user-stats",
        [Cl.principal(wallet1)],
        deployer
      );

      const stats = cvToValue(result.result);
      expect(stats.value["total-bets-placed"].value).toBe(15000000n);
    });
  });

  describe("Fee Collection", () => {
    it("should track total fees collected", async () => {
      const settlementHeight = simnet.burnBlockHeight + 100;
      
      // Create multiple markets
      for (let i = 0; i < 3; i++) {
        simnet.callPublicFn(
          CONTRACT_NAME,
          "create-binary-market",
          [
            Cl.stringUtf8(`Market ${i}`),
            Cl.stringUtf8("Description"),
            Cl.uint(settlementHeight + i * 100),
          ],
          wallet1
        );
      }

      const result = simnet.callReadOnlyFn(
        CONTRACT_NAME,
        "get-total-fees-collected",
        [],
        deployer
      );

      expect(result.result).toBeUint(MARKET_CREATION_FEE * 3n);
    });
  });
});

describe("Prediction Token Tests", () => {
  let simnet: Awaited<ReturnType<typeof initSimnet>>;
  let deployer: string;
  let wallet1: string;
  let wallet2: string;

  const TOKEN_CONTRACT = "prediction-token";

  beforeEach(async () => {
    simnet = await initSimnet();
    const accounts = simnet.getAccounts();
    deployer = accounts.get("deployer")!;
    wallet1 = accounts.get("wallet_1")!;
    wallet2 = accounts.get("wallet_2")!;
  });

  describe("SIP-010 Compliance", () => {
    it("should return token name", async () => {
      const result = simnet.callReadOnlyFn(
        TOKEN_CONTRACT,
        "get-name",
        [],
        deployer
      );
      expect(result.result).toBeOk(Cl.stringAscii("Prediction Market Token"));
    });

    it("should return token symbol", async () => {
      const result = simnet.callReadOnlyFn(
        TOKEN_CONTRACT,
        "get-symbol",
        [],
        deployer
      );
      expect(result.result).toBeOk(Cl.stringAscii("PMT"));
    });

    it("should return decimals", async () => {
      const result = simnet.callReadOnlyFn(
        TOKEN_CONTRACT,
        "get-decimals",
        [],
        deployer
      );
      expect(result.result).toBeOk(Cl.uint(6));
    });
  });

  describe("Minting", () => {
    it("should allow owner to mint tokens", async () => {
      const mintAmount = 1000000000n; // 1000 tokens

      const result = simnet.callPublicFn(
        TOKEN_CONTRACT,
        "mint",
        [Cl.uint(mintAmount), Cl.principal(wallet1)],
        deployer
      );

      expect(result.result).toBeOk(Cl.bool(true));

      // Check balance
      const balanceResult = simnet.callReadOnlyFn(
        TOKEN_CONTRACT,
        "get-balance",
        [Cl.principal(wallet1)],
        deployer
      );

      expect(balanceResult.result).toBeOk(Cl.uint(mintAmount));
    });

    it("should reject unauthorized minting", async () => {
      const result = simnet.callPublicFn(
        TOKEN_CONTRACT,
        "mint",
        [Cl.uint(1000000n), Cl.principal(wallet2)],
        wallet1 // Not authorized
      );

      expect(result.result).toBeErr(Cl.uint(2000)); // ERR-NOT-AUTHORIZED
    });
  });

  describe("Transfers", () => {
    beforeEach(async () => {
      // Mint some tokens first
      simnet.callPublicFn(
        TOKEN_CONTRACT,
        "mint",
        [Cl.uint(10000000000n), Cl.principal(wallet1)],
        deployer
      );
    });

    it("should transfer tokens between accounts", async () => {
      const transferAmount = 5000000000n;

      const result = simnet.callPublicFn(
        TOKEN_CONTRACT,
        "transfer",
        [
          Cl.uint(transferAmount),
          Cl.principal(wallet1),
          Cl.principal(wallet2),
          Cl.none(),
        ],
        wallet1
      );

      expect(result.result).toBeOk(Cl.bool(true));

      // Verify balances
      const balance1 = simnet.callReadOnlyFn(
        TOKEN_CONTRACT,
        "get-balance",
        [Cl.principal(wallet1)],
        deployer
      );
      const balance2 = simnet.callReadOnlyFn(
        TOKEN_CONTRACT,
        "get-balance",
        [Cl.principal(wallet2)],
        deployer
      );

      expect(balance1.result).toBeOk(Cl.uint(5000000000n));
      expect(balance2.result).toBeOk(Cl.uint(5000000000n));
    });

    it("should reject transfer from non-owner", async () => {
      const result = simnet.callPublicFn(
        TOKEN_CONTRACT,
        "transfer",
        [
          Cl.uint(1000000n),
          Cl.principal(wallet1),
          Cl.principal(wallet2),
          Cl.none(),
        ],
        wallet2 // Trying to transfer wallet1's tokens
      );

      expect(result.result).toBeErr(Cl.uint(2001)); // ERR-NOT-TOKEN-OWNER
    });
  });
});
