;; Bitcoin-Anchored Prediction Market V7 - Full Features
;; With ownership transfer, betting, settlement, and claiming

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
(define-constant ERR-INSUFFICIENT-FEE-BALANCE (err u1016))

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
    
    (ok market-id))
)

;; Create a multi-outcome market (up to 4 outcomes)
(define-public (create-multi-market
    (title (string-utf8 256))
    (description (string-utf8 1024))
    (settlement-burn-height uint)
    (enable-outcome-a bool)
    (enable-outcome-b bool)
    (enable-outcome-c bool)
    (enable-outcome-d bool))
  (let (
    (market-id (var-get market-nonce))
    (current-burn-height tenure-height)
    (packed-outcomes (pack-outcomes enable-outcome-a enable-outcome-b enable-outcome-c enable-outcome-d))
  )
    (asserts! (not (var-get platform-paused)) ERR-NOT-AUTHORIZED)
    (asserts! (> settlement-burn-height (+ current-burn-height BLOCKS-BEFORE-SETTLEMENT)) ERR-INVALID-MARKET-PARAMS)
    (asserts! (>= (count-enabled-outcomes packed-outcomes) u2) ERR-INVALID-MARKET-PARAMS)
    
    (try! (stx-transfer? MARKET-CREATION-FEE tx-sender (var-get contract-owner)))
    
    (map-set markets market-id {
      creator: tx-sender,
      title: title,
      description: description,
      settlement-burn-height: settlement-burn-height,
      settlement-type: "hash-range",
      possible-outcomes: packed-outcomes,
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
    
    (ok market-id))
)

;; =============================================
;; BETTING FUNCTIONS
;; =============================================

(define-public (bet-outcome-a (market-id uint) (amount uint))
  (place-bet-internal market-id amount OUTCOME-A)
)

(define-public (bet-outcome-b (market-id uint) (amount uint))
  (place-bet-internal market-id amount OUTCOME-B)
)

(define-public (bet-outcome-c (market-id uint) (amount uint))
  (place-bet-internal market-id amount OUTCOME-C)
)

(define-public (bet-outcome-d (market-id uint) (amount uint))
  (place-bet-internal market-id amount OUTCOME-D)
)

(define-private (place-bet-internal (market-id uint) (amount uint) (outcome uint))
  (let (
    (market (unwrap! (map-get? markets market-id) ERR-MARKET-NOT-FOUND))
    (current-burn-height tenure-height)
    (current-position (default-to 
      { outcome-a-amount: u0, outcome-b-amount: u0, outcome-c-amount: u0, outcome-d-amount: u0, total-invested: u0, claimed: false }
      (map-get? user-positions { market-id: market-id, user: tx-sender })))
  )
    (asserts! (not (var-get platform-paused)) ERR-NOT-AUTHORIZED)
    (asserts! (not (get settled market)) ERR-MARKET-CLOSED)
    (asserts! (< current-burn-height (get settlement-burn-height market)) ERR-MARKET-CLOSED)
    (asserts! (is-outcome-enabled (get possible-outcomes market) outcome) ERR-INVALID-OUTCOME)
    (asserts! (>= amount MIN-BET-AMOUNT) ERR-BET-TOO-SMALL)
    
    (try! (stx-transfer? amount tx-sender (as-contract tx-sender)))
    
    (map-set markets market-id (merge market {
      total-pool: (+ (get total-pool market) amount),
      outcome-a-pool: (if (is-eq outcome OUTCOME-A) (+ (get outcome-a-pool market) amount) (get outcome-a-pool market)),
      outcome-b-pool: (if (is-eq outcome OUTCOME-B) (+ (get outcome-b-pool market) amount) (get outcome-b-pool market)),
      outcome-c-pool: (if (is-eq outcome OUTCOME-C) (+ (get outcome-c-pool market) amount) (get outcome-c-pool market)),
      outcome-d-pool: (if (is-eq outcome OUTCOME-D) (+ (get outcome-d-pool market) amount) (get outcome-d-pool market))
    }))
    
    (map-set user-positions { market-id: market-id, user: tx-sender } {
      outcome-a-amount: (if (is-eq outcome OUTCOME-A) (+ (get outcome-a-amount current-position) amount) (get outcome-a-amount current-position)),
      outcome-b-amount: (if (is-eq outcome OUTCOME-B) (+ (get outcome-b-amount current-position) amount) (get outcome-b-amount current-position)),
      outcome-c-amount: (if (is-eq outcome OUTCOME-C) (+ (get outcome-c-amount current-position) amount) (get outcome-c-amount current-position)),
      outcome-d-amount: (if (is-eq outcome OUTCOME-D) (+ (get outcome-d-amount current-position) amount) (get outcome-d-amount current-position)),
      total-invested: (+ (get total-invested current-position) amount),
      claimed: false
    })
    
    (update-user-bets-placed tx-sender amount)
    (add-participant market-id tx-sender)
    
    (ok { market-id: market-id, outcome: outcome, amount: amount }))
)

;; =============================================
;; SETTLEMENT
;; =============================================

(define-public (settle-market (market-id uint))
  (let (
    (market (unwrap! (map-get? markets market-id) ERR-MARKET-NOT-FOUND))
    (settlement-height (get settlement-burn-height market))
    (current-burn-height tenure-height)
    (block-hash (unwrap! (get-burn-block-info? header-hash settlement-height) ERR-BURN-BLOCK-NOT-AVAILABLE))
    (num-outcomes (count-enabled-outcomes (get possible-outcomes market)))
    (winning-outcome (if (is-eq (get settlement-type market) "hash-even-odd")
                        (if (is-hash-even block-hash) OUTCOME-A OUTCOME-B)
                        (determine-outcome-from-hash block-hash num-outcomes)))
  )
    (asserts! (not (get settled market)) ERR-MARKET-ALREADY-SETTLED)
    (asserts! (>= current-burn-height (+ settlement-height BLOCKS-BEFORE-SETTLEMENT)) ERR-MARKET-NOT-READY-TO-SETTLE)
    
    (map-set markets market-id (merge market {
      settled: true,
      winning-outcome: (some winning-outcome),
      settled-at-burn-height: (some current-burn-height),
      settlement-block-hash: (some block-hash)
    }))
    
    (ok { 
      market-id: market-id, 
      winning-outcome: winning-outcome,
      block-hash: block-hash,
      settlement-height: settlement-height
    }))
)

;; =============================================
;; CLAIMING WINNINGS
;; =============================================

(define-public (claim-winnings (market-id uint))
  (let (
    (claimant tx-sender)
    (market (unwrap! (map-get? markets market-id) ERR-MARKET-NOT-FOUND))
    (position (unwrap! (map-get? user-positions { market-id: market-id, user: claimant }) ERR-NO-POSITION))
    (winning-outcome (unwrap! (get winning-outcome market) ERR-MARKET-NOT-SETTLED))
  )
    (asserts! (get settled market) ERR-MARKET-NOT-SETTLED)
    (asserts! (not (get claimed position)) ERR-ALREADY-CLAIMED)
    
    (let (
      (user-winning-amount (get-position-for-outcome position winning-outcome))
      (winning-pool (get-pool-for-outcome market winning-outcome))
      (total-pool (get total-pool market))
      (gross-payout (if (is-eq winning-pool u0) 
                       u0 
                       (/ (* user-winning-amount total-pool) winning-pool)))
      (platform-fee (/ (* gross-payout PLATFORM-FEE-PERCENT) u10000))
      (net-payout (- gross-payout platform-fee))
    )
      (asserts! (> user-winning-amount u0) ERR-NO-POSITION)
      
      (map-set user-positions { market-id: market-id, user: claimant }
        (merge position { claimed: true }))
      
      (if (> net-payout u0)
        (begin
          (try! (as-contract (stx-transfer? net-payout tx-sender claimant)))
          (var-set total-fees-collected (+ (var-get total-fees-collected) platform-fee))
          (update-user-winnings claimant net-payout)
          (ok {
            market-id: market-id,
            gross-payout: gross-payout,
            platform-fee: platform-fee,
            net-payout: net-payout
          }))
        (ok {
          market-id: market-id,
          gross-payout: u0,
          platform-fee: u0,
          net-payout: u0
        })))
  )
)

;; =============================================
;; PRIVATE HELPERS
;; =============================================

(define-private (get-position-for-outcome (position { outcome-a-amount: uint, outcome-b-amount: uint, outcome-c-amount: uint, outcome-d-amount: uint, total-invested: uint, claimed: bool }) (outcome uint))
  (if (is-eq outcome OUTCOME-A) (get outcome-a-amount position)
    (if (is-eq outcome OUTCOME-B) (get outcome-b-amount position)
      (if (is-eq outcome OUTCOME-C) (get outcome-c-amount position)
        (get outcome-d-amount position))))
)

(define-private (get-pool-for-outcome (market { creator: principal, title: (string-utf8 256), description: (string-utf8 1024), settlement-burn-height: uint, settlement-type: (string-ascii 32), possible-outcomes: uint, total-pool: uint, outcome-a-pool: uint, outcome-b-pool: uint, outcome-c-pool: uint, outcome-d-pool: uint, winning-outcome: (optional uint), settled: bool, settled-at-burn-height: (optional uint), settlement-block-hash: (optional (buff 32)), created-at-burn-height: uint, created-at-stacks-height: uint }) (outcome uint))
  (if (is-eq outcome OUTCOME-A) (get outcome-a-pool market)
    (if (is-eq outcome OUTCOME-B) (get outcome-b-pool market)
      (if (is-eq outcome OUTCOME-C) (get outcome-c-pool market)
        (get outcome-d-pool market))))
)

(define-private (update-user-bets-placed (user principal) (amount uint))
  (let ((stats (default-to 
    { markets-created: u0, total-bets-placed: u0, total-winnings: u0, total-losses: u0, achievements: u0 }
    (map-get? user-stats user))))
    (map-set user-stats user (merge stats {
      total-bets-placed: (+ (get total-bets-placed stats) amount)
    })))
)

(define-private (update-user-winnings (user principal) (amount uint))
  (let ((stats (default-to 
    { markets-created: u0, total-bets-placed: u0, total-winnings: u0, total-losses: u0, achievements: u0 }
    (map-get? user-stats user))))
    (map-set user-stats user (merge stats {
      total-winnings: (+ (get total-winnings stats) amount)
    })))
)

(define-private (add-participant (market-id uint) (user principal))
  (let ((current-participants (default-to (list) (map-get? market-participants market-id))))
    (if (is-none (index-of? current-participants user))
      (begin
        (map-set market-participants market-id (unwrap! (as-max-len? (append current-participants user) u500) false))
        true)
      true))
)

(define-private (calculate-odds (outcome-pool uint) (total-pool uint))
  (if (is-eq outcome-pool u0)
    u0
    (/ (* total-pool u10000) outcome-pool))
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

(define-read-only (get-user-stats (user principal))
  (map-get? user-stats user)
)

(define-read-only (get-market-participants (market-id uint))
  (map-get? market-participants market-id)
)

(define-read-only (get-market-odds (market-id uint))
  (let ((market (unwrap! (map-get? markets market-id) none)))
    (some {
      outcome-a-odds: (calculate-odds (get outcome-a-pool market) (get total-pool market)),
      outcome-b-odds: (calculate-odds (get outcome-b-pool market) (get total-pool market)),
      outcome-c-odds: (calculate-odds (get outcome-c-pool market) (get total-pool market)),
      outcome-d-odds: (calculate-odds (get outcome-d-pool market) (get total-pool market)),
      total-pool: (get total-pool market)
    }))
)

(define-read-only (calculate-potential-payout (market-id uint) (outcome uint) (bet-amount uint))
  (let (
    (market (unwrap! (map-get? markets market-id) none))
    (outcome-pool (get-pool-for-outcome market outcome))
    (new-pool (+ outcome-pool bet-amount))
    (new-total (+ (get total-pool market) bet-amount))
    (gross-payout (/ (* bet-amount new-total) new-pool))
    (platform-fee (/ (* gross-payout PLATFORM-FEE-PERCENT) u10000))
  )
    (some {
      gross-payout: gross-payout,
      platform-fee: platform-fee,
      net-payout: (- gross-payout platform-fee)
    }))
)

(define-read-only (get-blocks-until-settlement (market-id uint))
  (let (
    (market (unwrap! (map-get? markets market-id) none))
    (current-burn-height tenure-height)
    (settlement-height (get settlement-burn-height market))
  )
    (if (>= current-burn-height settlement-height)
      (some u0)
      (some (- settlement-height current-burn-height))))
)

(define-read-only (is-market-settleable (market-id uint))
  (let (
    (market (unwrap! (map-get? markets market-id) (some false)))
    (current-burn-height tenure-height)
    (settlement-height (get settlement-burn-height market))
  )
    (some (and 
      (not (get settled market))
      (>= current-burn-height (+ settlement-height BLOCKS-BEFORE-SETTLEMENT)))))
)

;; =============================================
;; ADMIN FUNCTIONS
;; =============================================

(define-public (withdraw-fees (amount uint) (recipient principal))
  (let ((available-fees (var-get total-fees-collected)))
    (asserts! (is-eq tx-sender (var-get contract-owner)) ERR-NOT-AUTHORIZED)
    (asserts! (<= amount available-fees) ERR-INSUFFICIENT-FEE-BALANCE)
    (try! (as-contract (stx-transfer? amount tx-sender recipient)))
    (var-set total-fees-collected (- available-fees amount))
    (ok amount))
)

(define-public (set-platform-paused (paused bool))
  (begin
    (asserts! (is-eq tx-sender (var-get contract-owner)) ERR-NOT-AUTHORIZED)
    (var-set platform-paused paused)
    (ok paused))
)

;; Settlement grace period – extra blocks after expiry during which
;; the creator can still settle without losing their creation stake.
(define-constant SETTLEMENT-GRACE-PERIOD u6)
