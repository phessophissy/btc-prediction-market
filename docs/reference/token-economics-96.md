# token economics Reference - Section 96

## Overview
Covers the token economics subsystem of the BTC Prediction Market platform.

## Architecture
The token economics module interacts with the smart contract layer (Clarity), SDK service abstraction, frontend components, and CLI tooling.

## Configuration
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `enabled` | boolean | `true` | Enable/disable token economics |
| `threshold` | number | `96` | Trigger threshold |
| `timeout` | number | `5000` | Timeout in ms |
| `retries` | number | `3` | Max retry attempts |
