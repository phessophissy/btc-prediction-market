;; Bitcoin-Anchored Prediction Market
;; A decentralized prediction market that settles based on Bitcoin block data
;; Uses Clarity 4 features: get-burn-block-info?, tenure-height, bitwise operations

;; Import SIP-010 trait for token interactions
(use-trait sip-010-trait .sip-010-trait.sip-010-trait)

;; =============================================
;; CONSTANTS
;; =============================================

;; Error codes
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

;; Platform constants
(define-constant CONTRACT-OWNER tx-sender)
(define-constant MARKET-CREATION-FEE u5000000) ;; 5 STX in microSTX
(define-constant PLATFORM-FEE-PERCENT u300) ;; 3% (basis points)
(define-constant MIN-BET-AMOUNT u1000000) ;; 1 STX minimum bet
(define-constant BLOCKS-BEFORE-SETTLEMENT u6) ;; Wait 6 Bitcoin blocks for finality

;; Outcome bit flags (Clarity 4 bitwise operations)
(define-constant OUTCOME-A u1) ;; 0001
(define-constant OUTCOME-B u2) ;; 0010
(define-constant OUTCOME-C u4) ;; 0100
(define-constant OUTCOME-D u8) ;; 1000

;; =============================================
;; DATA VARIABLES
;; =============================================

(define-data-var market-nonce uint u0)
(define-data-var total-fees-collected uint u0)
(define-data-var platform-paused bool false)

;; =============================================
;; DATA MAPS
;; =============================================

;; Main market storage
(define-map markets
  uint ;; market-id
  {
    creator: principal,
    title: (string-utf8 256),
    description: (string-utf8 1024),
    settlement-burn-height: uint, ;; Bitcoin block height for settlement
    settlement-type: (string-ascii 32), ;; "hash-even-odd", "hash-range", "manual"
    possible-outcomes: uint, ;; Bitwise packed outcomes (e.g., u3 = OUTCOME-A | OUTCOME-B)
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
  }
)

;; User positions in markets
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

;; User stats (using bitwise flags for achievements)
(define-map user-stats
  principal
  {
    markets-created: uint,
    total-bets-placed: uint,
    total-winnings: uint,
    total-losses: uint,
    achievements: uint ;; Bitwise packed achievement flags
  }
)

;; Market participants list
(define-map market-participants
  uint ;; market-id
  (list 500 principal)
)

;; =============================================
;; CLARITY 4 HELPER FUNCTIONS
;; =============================================

;; Get current Bitcoin block height (Clarity 4: tenure-height)
(define-read-only (get-current-burn-height)
  tenure-height
)

;; Get Bitcoin block hash for verification (Clarity 4: get-burn-block-info?)
(define-read-only (get-burn-block-hash (burn-height uint))
  (get-burn-block-info? header-hash burn-height)
)

;; Get user's STX account info (Clarity 4: stx-account)
(define-read-only (get-user-stx-info (user principal))
  (stx-account user)
)

;; Check if user has locked STX (premium user feature)
(define-read-only (is-premium-user (user principal))
  (let ((account (stx-account user)))
    (>= (get locked account) u100000000) ;; 100+ STX locked = premium
  )
)

;; Extract specific byte from hash using slice (Clarity 4: slice?)
(define-read-only (get-hash-byte (hash (buff 32)) (index uint))
  (slice? hash index (+ index u1))
)

;; Convert outcome to string for display (Clarity 4: int-to-ascii)
(define-read-only (outcome-to-string (outcome uint))
  (if (is-eq outcome OUTCOME-A) "A"
    (if (is-eq outcome OUTCOME-B) "B"
      (if (is-eq outcome OUTCOME-C) "C"
        (if (is-eq outcome OUTCOME-D) "D"
          "?"))))
)

;; =============================================
;; BITWISE OPERATION HELPERS (Clarity 4)
;; =============================================

;; Check if an outcome is enabled in the packed outcomes
(define-read-only (is-outcome-enabled (packed-outcomes uint) (outcome uint))
  (> (bit-and packed-outcomes outcome) u0)
)

;; Pack multiple outcomes into single value
(define-read-only (pack-outcomes (a bool) (b bool) (c bool) (d bool))
  (bit-or
    (bit-or
      (if a OUTCOME-A u0)
      (if b OUTCOME-B u0))
    (bit-or
      (if c OUTCOME-C u0)
      (if d OUTCOME-D u0)))
)

;; Count enabled outcomes
(define-read-only (count-enabled-outcomes (packed uint))
  (+ 
    (+ 
      (if (is-outcome-enabled packed OUTCOME-A) u1 u0)
      (if (is-outcome-enabled packed OUTCOME-B) u1 u0))
    (+
      (if (is-outcome-enabled packed OUTCOME-C) u1 u0)
      (if (is-outcome-enabled packed OUTCOME-D) u1 u0)))
)

;; Determine winning outcome from Bitcoin block hash
;; Uses first byte of hash to determine outcome
(define-read-only (determine-outcome-from-hash (block-hash (buff 32)) (num-outcomes uint))
  (let (
    ;; Get first byte of hash using element-at and convert to uint
    (first-byte-opt (element-at? block-hash u0))
    (first-byte (match first-byte-opt
                  byte (buff-to-uint-be byte)
                  u0))
    (outcome-index (mod first-byte num-outcomes))
  )
    ;; Map index to outcome flag
    (if (is-eq outcome-index u0) OUTCOME-A
      (if (is-eq outcome-index u1) OUTCOME-B
        (if (is-eq outcome-index u2) OUTCOME-C
          OUTCOME-D))))
)

;; Check if hash is "even" (last byte is even number)
(define-read-only (is-hash-even (block-hash (buff 32)))
  (let (
    (last-byte-opt (element-at? block-hash u31))
    (last-byte (match last-byte-opt
                 byte (buff-to-uint-be byte)
                 u0))
  )
    (is-eq (mod last-byte u2) u0))
)

;; =============================================
;; PUBLIC FUNCTIONS - MARKET CREATION
;; =============================================

;; Create a new binary prediction market (2 outcomes)
(define-public (create-binary-market 
    (title (string-utf8 256))
    (description (string-utf8 1024))
    (settlement-burn-height uint))
  (let (
    (market-id (var-get market-nonce))
    (current-burn-height tenure-height)
  )
    ;; Validate parameters
    (asserts! (> settlement-burn-height (+ current-burn-height BLOCKS-BEFORE-SETTLEMENT)) ERR-INVALID-MARKET-PARAMS)
    
    ;; Charge market creation fee
    (try! (stx-transfer? MARKET-CREATION-FEE tx-sender CONTRACT-OWNER))
    
    ;; Create market
    (map-set markets market-id {
      creator: tx-sender,
      title: title,
      description: description,
      settlement-burn-height: settlement-burn-height,
      settlement-type: "hash-even-odd",
      possible-outcomes: (pack-outcomes true true false false), ;; Only A and B
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
    
    ;; Initialize participants list
    (map-set market-participants market-id (list))
    
    ;; Update user stats
    (update-user-markets-created tx-sender)
    
    ;; Increment nonce
    (var-set market-nonce (+ market-id u1))
    (var-set total-fees-collected (+ (var-get total-fees-collected) MARKET-CREATION-FEE))
    
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
    ;; Validate parameters
    (asserts! (> settlement-burn-height (+ current-burn-height BLOCKS-BEFORE-SETTLEMENT)) ERR-INVALID-MARKET-PARAMS)
    (asserts! (>= (count-enabled-outcomes packed-outcomes) u2) ERR-INVALID-MARKET-PARAMS)
    
    ;; Charge market creation fee
    (try! (stx-transfer? MARKET-CREATION-FEE tx-sender CONTRACT-OWNER))
    
    ;; Create market
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
    
    ;; Initialize participants list
    (map-set market-participants market-id (list))
    
    ;; Update user stats
    (update-user-markets-created tx-sender)
    
    ;; Increment nonce
    (var-set market-nonce (+ market-id u1))
    (var-set total-fees-collected (+ (var-get total-fees-collected) MARKET-CREATION-FEE))
    
    (ok market-id))
)

;; =============================================
;; PUBLIC FUNCTIONS - BETTING
;; =============================================

;; Place a bet on outcome A
(define-public (bet-outcome-a (market-id uint) (amount uint))
  (place-bet-internal market-id amount OUTCOME-A)
)

;; Place a bet on outcome B
(define-public (bet-outcome-b (market-id uint) (amount uint))
  (place-bet-internal market-id amount OUTCOME-B)
)

;; Place a bet on outcome C
(define-public (bet-outcome-c (market-id uint) (amount uint))
  (place-bet-internal market-id amount OUTCOME-C)
)

;; Place a bet on outcome D
(define-public (bet-outcome-d (market-id uint) (amount uint))
  (place-bet-internal market-id amount OUTCOME-D)
)

;; Internal bet placement logic
(define-private (place-bet-internal (market-id uint) (amount uint) (outcome uint))
  (let (
    (market (unwrap! (map-get? markets market-id) ERR-MARKET-NOT-FOUND))
    (current-burn-height tenure-height)
    (current-position (default-to 
      { outcome-a-amount: u0, outcome-b-amount: u0, outcome-c-amount: u0, outcome-d-amount: u0, total-invested: u0, claimed: false }
      (map-get? user-positions { market-id: market-id, user: tx-sender })))
  )
    ;; Validate bet
    (asserts! (not (get settled market)) ERR-MARKET-CLOSED)
    (asserts! (< current-burn-height (get settlement-burn-height market)) ERR-MARKET-CLOSED)
    (asserts! (is-outcome-enabled (get possible-outcomes market) outcome) ERR-INVALID-OUTCOME)
    (asserts! (>= amount MIN-BET-AMOUNT) ERR-BET-TOO-SMALL)
    
    ;; Transfer STX to contract
    (try! (stx-transfer? amount tx-sender (as-contract tx-sender)))
    
    ;; Update market pools
    (map-set markets market-id (merge market {
      total-pool: (+ (get total-pool market) amount),
      outcome-a-pool: (if (is-eq outcome OUTCOME-A) (+ (get outcome-a-pool market) amount) (get outcome-a-pool market)),
      outcome-b-pool: (if (is-eq outcome OUTCOME-B) (+ (get outcome-b-pool market) amount) (get outcome-b-pool market)),
      outcome-c-pool: (if (is-eq outcome OUTCOME-C) (+ (get outcome-c-pool market) amount) (get outcome-c-pool market)),
      outcome-d-pool: (if (is-eq outcome OUTCOME-D) (+ (get outcome-d-pool market) amount) (get outcome-d-pool market))
    }))
    
    ;; Update user position
    (map-set user-positions { market-id: market-id, user: tx-sender } {
      outcome-a-amount: (if (is-eq outcome OUTCOME-A) (+ (get outcome-a-amount current-position) amount) (get outcome-a-amount current-position)),
      outcome-b-amount: (if (is-eq outcome OUTCOME-B) (+ (get outcome-b-amount current-position) amount) (get outcome-b-amount current-position)),
      outcome-c-amount: (if (is-eq outcome OUTCOME-C) (+ (get outcome-c-amount current-position) amount) (get outcome-c-amount current-position)),
      outcome-d-amount: (if (is-eq outcome OUTCOME-D) (+ (get outcome-d-amount current-position) amount) (get outcome-d-amount current-position)),
      total-invested: (+ (get total-invested current-position) amount),
      claimed: false
    })
    
    ;; Update user stats
    (update-user-bets-placed tx-sender amount)
    
    ;; Add to participants list
    (add-participant market-id tx-sender)
    
    (ok { market-id: market-id, outcome: outcome, amount: amount }))
)

;; =============================================
;; PUBLIC FUNCTIONS - SETTLEMENT
;; =============================================

;; Settle market using Bitcoin block hash (anyone can call after settlement height)
(define-public (settle-market (market-id uint))
  (let (
    (market (unwrap! (map-get? markets market-id) ERR-MARKET-NOT-FOUND))
    (settlement-height (get settlement-burn-height market))
    (current-burn-height tenure-height)
    ;; Clarity 4: Get Bitcoin block hash for settlement
    (block-hash (unwrap! (get-burn-block-info? header-hash settlement-height) ERR-BURN-BLOCK-NOT-AVAILABLE))
    (num-outcomes (count-enabled-outcomes (get possible-outcomes market)))
    (winning-outcome (if (is-eq (get settlement-type market) "hash-even-odd")
                        (if (is-hash-even block-hash) OUTCOME-A OUTCOME-B)
                        (determine-outcome-from-hash block-hash num-outcomes)))
  )
    ;; Validate settlement
    (asserts! (not (get settled market)) ERR-MARKET-ALREADY-SETTLED)
    (asserts! (>= current-burn-height (+ settlement-height BLOCKS-BEFORE-SETTLEMENT)) ERR-MARKET-NOT-READY-TO-SETTLE)
    
    ;; Update market with settlement info
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
;; PUBLIC FUNCTIONS - CLAIMING WINNINGS
;; =============================================

;; Claim winnings from a settled market
(define-public (claim-winnings (market-id uint))
  (let (
    (market (unwrap! (map-get? markets market-id) ERR-MARKET-NOT-FOUND))
    (position (unwrap! (map-get? user-positions { market-id: market-id, user: tx-sender }) ERR-NO-POSITION))
    (winning-outcome (unwrap! (get winning-outcome market) ERR-MARKET-NOT-SETTLED))
  )
    ;; Validate claim
    (asserts! (get settled market) ERR-MARKET-NOT-SETTLED)
    (asserts! (not (get claimed position)) ERR-ALREADY-CLAIMED)
    
    (let (
      ;; Calculate user's winning bet amount
      (user-winning-amount (get-position-for-outcome position winning-outcome))
      ;; Get total pool for winning outcome
      (winning-pool (get-pool-for-outcome market winning-outcome))
      ;; Calculate payout
      (total-pool (get total-pool market))
      (gross-payout (if (is-eq winning-pool u0) 
                       u0 
                       (/ (* user-winning-amount total-pool) winning-pool)))
      ;; Calculate platform fee (3%)
      (platform-fee (/ (* gross-payout PLATFORM-FEE-PERCENT) u10000))
      (net-payout (- gross-payout platform-fee))
    )
      ;; Check if user has winning position
      (asserts! (> user-winning-amount u0) ERR-NO-POSITION)
      
      ;; Mark as claimed
      (map-set user-positions { market-id: market-id, user: tx-sender }
        (merge position { claimed: true }))
      
      ;; Transfer winnings (minus fee)
      (if (> net-payout u0)
        (begin
          (try! (as-contract (stx-transfer? net-payout tx-sender (unwrap! (element-at? (list tx-sender) u0) ERR-TRANSFER-FAILED))))
          (var-set total-fees-collected (+ (var-get total-fees-collected) platform-fee))
          ;; Update user stats
          (update-user-winnings tx-sender net-payout)
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
;; HELPER FUNCTIONS
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

(define-private (update-user-markets-created (user principal))
  (let ((stats (default-to 
    { markets-created: u0, total-bets-placed: u0, total-winnings: u0, total-losses: u0, achievements: u0 }
    (map-get? user-stats user))))
    (map-set user-stats user (merge stats {
      markets-created: (+ (get markets-created stats) u1)
    })))
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

(define-read-only (get-user-stats (user principal))
  (map-get? user-stats user)
)

(define-read-only (get-market-participants (market-id uint))
  (map-get? market-participants market-id)
)

(define-read-only (get-total-fees-collected)
  (var-get total-fees-collected)
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

(define-private (calculate-odds (outcome-pool uint) (total-pool uint))
  (if (is-eq outcome-pool u0)
    u0
    (/ (* total-pool u10000) outcome-pool)) ;; Returns odds in basis points (100x multiplier)
)

;; Calculate potential payout for a bet
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

;; Get time until settlement (in Bitcoin blocks)
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

;; Check if market is ready to be settled
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
  (begin
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-NOT-AUTHORIZED)
    (as-contract (stx-transfer? amount tx-sender recipient)))
)

(define-public (set-platform-paused (paused bool))
  (begin
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-NOT-AUTHORIZED)
    (var-set platform-paused paused)
    (ok paused))
)
