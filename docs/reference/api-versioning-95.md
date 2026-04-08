# api versioning Reference - Section 95

## Overview
Covers the api versioning subsystem of the BTC Prediction Market platform.

## Architecture
The api versioning module interacts with the smart contract layer (Clarity), SDK service abstraction, frontend components, and CLI tooling.

## Configuration
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `enabled` | boolean | `true` | Enable/disable api versioning |
| `threshold` | number | `95` | Trigger threshold |
| `timeout` | number | `5000` | Timeout in ms |
| `retries` | number | `3` | Max retry attempts |
