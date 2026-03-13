# Contract V3 Overview

`contracts/btc-prediction-market-v3.clar` is the contract version the frontend now targets by default.

## Differences from V1

- Reduced market creation fee
- Reduced minimum bet
- Added ownership transfer controls
- Added emergency mode and emergency withdrawal paths
- Current checked-in V3 surface is narrower than the older frontend assumptions:
  it exposes market creation plus owner/read-only paths, but not the legacy
  bet/settle/claim helper functions the UI used to call directly.

## Operational takeaway

Any operator or frontend change should confirm whether it is aligned with V1 docs or the actual V3 contract surface before shipping. If the frontend targets V3, unsupported actions should be hidden or derived client-side rather than calling missing contract functions.
