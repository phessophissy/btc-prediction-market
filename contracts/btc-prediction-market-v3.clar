;; Bitcoin-Anchored Prediction Market V3 - Reduced Fees
;; With ownership transfer and emergency migration support

;; Trait already deployed on mainnet
;; (use-trait sip-010-trait .sip-010-trait.sip-010-trait)

;; =============================================
;; CONSTANTS
;; =============================================

(define-constant ERR-NOT-AUTHORIZED (err u1000))
(define-constant ERR-MARKET-NOT-FOUND (err u1001))
(define-constant ERR-MARKET-CLOSED (err u1002))
(define-constant ERR-MARKET-NOT-SETTLED (err u1003))
(define-constant ERR-MARKET-ALREADY-SETTLED (err u1004))
(define-constant ERR-INVALID-OUTCOME (err u1005))
(define-constant ERR-INSUFFICIENT-FUNDS (err u1006))
(define-constant ERR-BET-TOO-SMALL (err u1007))
(define-constant ERR-ALREADY-CLAIMED (err u1008))
(define-constant ERR-NO-POSITION (err u1009))
(define-constant ERR-BURN-BLOCK-NOT-AVAILABLE (err u1010))
(define-constant ERR-INVALID-MARKET-PARAMS (err u1011))
(define-constant ERR-MARKET-NOT-READY-TO-SETTLE (err u1012))
(define-constant ERR-TRANSFER-FAILED (err u1013))
(define-constant ERR-PENDING-OWNER-ONLY (err u1014))
(define-constant ERR-NO-PENDING-OWNER (err u1015))

;; Platform constants
(define-constant INITIAL-OWNER tx-sender)
(define-constant MARKET-CREATION-FEE u100000)
(define-constant PLATFORM-FEE-PERCENT u300)
(define-constant MIN-BET-AMOUNT u10000)
(define-constant BLOCKS-BEFORE-SETTLEMENT u6)

;; Outcome flags
(define-constant OUTCOME-A u1)
(define-constant OUTCOME-B u2)
(define-constant OUTCOME-C u4)
(define-constant OUTCOME-D u8)

;; =============================================
;; DATA VARIABLES - WITH OWNERSHIP TRANSFER
;; =============================================

;; MUTABLE owner - can be transferred!
(define-data-var contract-owner principal tx-sender)
(define-data-var pending-owner (optional principal) none)

(define-data-var market-nonce uint u0)
(define-data-var total-fees-collected uint u0)
(define-data-var platform-paused bool false)
(define-data-var emergency-mode bool false)

;; =============================================
;; OWNERSHIP TRANSFER FUNCTIONS
;; =============================================

;; Get current owner
(define-read-only (get-owner)
  (var-get contract-owner)
)

;; Get pending owner
(define-read-only (get-pending-owner)
  (var-get pending-owner)
)

;; Check if caller is owner
(define-read-only (is-owner (caller principal))
  (is-eq caller (var-get contract-owner))
)

;; Step 1: Current owner initiates transfer
(define-public (transfer-ownership (new-owner principal))
  (begin
    (asserts! (is-eq tx-sender (var-get contract-owner)) ERR-NOT-AUTHORIZED)
    (var-set pending-owner (some new-owner))
    (print { event: "ownership-transfer-initiated", from: tx-sender, to: new-owner })
    (ok true))
)

;; Step 2: New owner accepts ownership
(define-public (accept-ownership)
  (let ((pending (var-get pending-owner)))
    (asserts! (is-some pending) ERR-NO-PENDING-OWNER)
    (asserts! (is-eq tx-sender (unwrap! pending ERR-NO-PENDING-OWNER)) ERR-PENDING-OWNER-ONLY)
    (let ((old-owner (var-get contract-owner)))
      (var-set contract-owner tx-sender)
      (var-set pending-owner none)
      (print { event: "ownership-transferred", from: old-owner, to: tx-sender })
      (ok true)))
)

;; Cancel pending transfer
(define-public (cancel-ownership-transfer)
  (begin
    (asserts! (is-eq tx-sender (var-get contract-owner)) ERR-NOT-AUTHORIZED)
    (var-set pending-owner none)
    (ok true))
)

;; =============================================
;; EMERGENCY FUNCTIONS
;; =============================================

;; Enable emergency mode (pauses all operations)
(define-public (enable-emergency-mode)
  (begin
    (asserts! (is-eq tx-sender (var-get contract-owner)) ERR-NOT-AUTHORIZED)
    (var-set emergency-mode true)
    (var-set platform-paused true)
    (print { event: "emergency-mode-enabled", by: tx-sender })
    (ok true))
)

;; Emergency withdraw ALL contract STX to owner
(define-public (emergency-withdraw-all)
  (let (
    (contract-balance (stx-get-balance (as-contract tx-sender)))
  )
    (asserts! (is-eq tx-sender (var-get contract-owner)) ERR-NOT-AUTHORIZED)
    (asserts! (var-get emergency-mode) ERR-NOT-AUTHORIZED)
    (if (> contract-balance u0)
      (begin
        (try! (as-contract (stx-transfer? contract-balance tx-sender (var-get contract-owner))))
        (print { event: "emergency-withdrawal", amount: contract-balance, to: (var-get contract-owner) })
        (ok contract-balance))
      (ok u0)))
)

;; Emergency withdraw specific amount
(define-public (emergency-withdraw (amount uint) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender (var-get contract-owner)) ERR-NOT-AUTHORIZED)
    (asserts! (var-get emergency-mode) ERR-NOT-AUTHORIZED)
    (try! (as-contract (stx-transfer? amount tx-sender recipient)))
    (print { event: "emergency-withdrawal", amount: amount, to: recipient })
    (ok amount))
)

;; Get contract STX balance
(define-read-only (get-contract-balance)
  (stx-get-balance (as-contract tx-sender))
)

;; =============================================
;; DATA MAPS (same as v1)
;; =============================================

(define-map markets uint {
  creator: principal,
  title: (string-utf8 256),
  description: (string-utf8 1024),
  settlement-burn-height: uint,
  settlement-type: (string-ascii 32),
  possible-outcomes: uint,
  total-pool: uint,
  outcome-a-pool: uint,
  outcome-b-pool: uint,
  outcome-c-pool: uint,
  outcome-d-pool: uint,
  winning-outcome: (optional uint),
  settled: bool,
  settled-at-burn-height: (optional uint),
  settlement-block-hash: (optional (buff 32)),
  created-at-burn-height: uint,
  created-at-stacks-height: uint
})

(define-map user-positions
  { market-id: uint, user: principal }
  {
    outcome-a-amount: uint,
    outcome-b-amount: uint,
    outcome-c-amount: uint,
    outcome-d-amount: uint,
    total-invested: uint,
    claimed: bool
  }
)

(define-map user-stats principal {
  markets-created: uint,
  total-bets-placed: uint,
  total-winnings: uint,
  total-losses: uint,
  achievements: uint
})

(define-map market-participants uint (list 500 principal))

;; =============================================
;; HELPER FUNCTIONS
;; =============================================

(define-read-only (get-current-burn-height)
  tenure-height
)

(define-read-only (is-outcome-enabled (packed-outcomes uint) (outcome uint))
  (> (bit-and packed-outcomes outcome) u0)
)

(define-read-only (pack-outcomes (a bool) (b bool) (c bool) (d bool))
  (bit-or
    (bit-or (if a OUTCOME-A u0) (if b OUTCOME-B u0))
    (bit-or (if c OUTCOME-C u0) (if d OUTCOME-D u0)))
)

(define-read-only (count-enabled-outcomes (packed uint))
  (+ (+ (if (is-outcome-enabled packed OUTCOME-A) u1 u0)
        (if (is-outcome-enabled packed OUTCOME-B) u1 u0))
     (+ (if (is-outcome-enabled packed OUTCOME-C) u1 u0)
        (if (is-outcome-enabled packed OUTCOME-D) u1 u0)))
)

(define-read-only (is-hash-even (block-hash (buff 32)))
  (let ((last-byte-opt (element-at? block-hash u31))
        (last-byte (match last-byte-opt byte (buff-to-uint-be byte) u0)))
    (is-eq (mod last-byte u2) u0))
)

(define-read-only (determine-outcome-from-hash (block-hash (buff 32)) (num-outcomes uint))
  (let (
    (first-byte-opt (element-at? block-hash u0))
    (first-byte (match first-byte-opt byte (buff-to-uint-be byte) u0))
    (outcome-index (mod first-byte num-outcomes))
  )
    (if (is-eq outcome-index u0) OUTCOME-A
      (if (is-eq outcome-index u1) OUTCOME-B
        (if (is-eq outcome-index u2) OUTCOME-C OUTCOME-D))))
)

;; =============================================
;; MARKET FUNCTIONS (with pause check)
;; =============================================

(define-public (create-binary-market 
    (title (string-utf8 256))
    (description (string-utf8 1024))
    (settlement-burn-height uint))
  (let (
    (market-id (var-get market-nonce))
    (current-burn-height tenure-height)
  )
    (asserts! (not (var-get platform-paused)) ERR-NOT-AUTHORIZED)
    (asserts! (> settlement-burn-height (+ current-burn-height BLOCKS-BEFORE-SETTLEMENT)) ERR-INVALID-MARKET-PARAMS)
    
    (try! (stx-transfer? MARKET-CREATION-FEE tx-sender (var-get contract-owner)))
    
    (map-set markets market-id {
      creator: tx-sender,
      title: title,
      description: description,
      settlement-burn-height: settlement-burn-height,
      settlement-type: "hash-even-odd",
      possible-outcomes: (pack-outcomes true true false false),
      total-pool: u0,
      outcome-a-pool: u0,
      outcome-b-pool: u0,
      outcome-c-pool: u0,
      outcome-d-pool: u0,
      winning-outcome: none,
      settled: false,
      settled-at-burn-height: none,
      settlement-block-hash: none,
      created-at-burn-height: current-burn-height,
      created-at-stacks-height: stacks-block-height
    })
    
    (map-set market-participants market-id (list))
    (var-set market-nonce (+ market-id u1))
    (var-set total-fees-collected (+ (var-get total-fees-collected) MARKET-CREATION-FEE))
    
    (ok market-id))
)

;; =============================================
;; READ-ONLY FUNCTIONS
;; =============================================

(define-read-only (get-market (market-id uint))
  (map-get? markets market-id)
)

(define-read-only (get-market-count)
  (var-get market-nonce)
)

(define-read-only (get-user-position (market-id uint) (user principal))
  (map-get? user-positions { market-id: market-id, user: user })
)

(define-read-only (get-total-fees-collected)
  (var-get total-fees-collected)
)

(define-read-only (is-paused)
  (var-get platform-paused)
)

(define-read-only (is-emergency)
  (var-get emergency-mode)
)

;; =============================================
;; ADMIN FUNCTIONS
;; =============================================

(define-public (withdraw-fees (amount uint) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender (var-get contract-owner)) ERR-NOT-AUTHORIZED)
    (as-contract (stx-transfer? amount tx-sender recipient)))
)

(define-public (set-platform-paused (paused bool))
  (begin
    (asserts! (is-eq tx-sender (var-get contract-owner)) ERR-NOT-AUTHORIZED)
    (var-set platform-paused paused)
    (ok paused))
)
