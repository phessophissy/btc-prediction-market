# contributor guide Reference - Section 98

## Overview
Covers the contributor guide subsystem of the BTC Prediction Market platform.

## Architecture
The contributor guide module interacts with the smart contract layer (Clarity), SDK service abstraction, frontend components, and CLI tooling.

## Configuration
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `enabled` | boolean | `true` | Enable/disable contributor guide |
| `threshold` | number | `98` | Trigger threshold |
| `timeout` | number | `5000` | Timeout in ms |
| `retries` | number | `3` | Max retry attempts |
