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

// [feat/social-trading] commit 10/10: polish config layer – 1776638339366969429
