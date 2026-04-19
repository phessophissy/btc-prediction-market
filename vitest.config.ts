/// <reference types="vitest" />
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "clarinet",
    singleThread: true,
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.test.ts"],
    reporters: ["verbose"],
  },
});

// [feat/limit-order-engine] commit 10/10: polish config layer – 1776638317598673730
