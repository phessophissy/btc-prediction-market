;; Prediction Token (PMT) - SIP-010 Fungible Token
;; Rewards token for the Bitcoin Prediction Market platform

(impl-trait .sip-010-trait.sip-010-trait)

;; =============================================
;; CONSTANTS
;; =============================================

(define-constant CONTRACT-OWNER tx-sender)
(define-constant ERR-NOT-AUTHORIZED (err u2000))
(define-constant ERR-NOT-TOKEN-OWNER (err u2001))
(define-constant ERR-INSUFFICIENT-BALANCE (err u2002))

;; Token metadata
(define-constant TOKEN-NAME "Prediction Market Token")
(define-constant TOKEN-SYMBOL "PMT")
(define-constant TOKEN-DECIMALS u6)
(define-constant TOKEN-URI (some u"https://btc-prediction-market.io/token-metadata.json"))

;; Initial supply and caps
(define-constant MAX-SUPPLY u1000000000000000) ;; 1 billion tokens with 6 decimals

;; =============================================
;; DATA VARIABLES
;; =============================================

(define-data-var total-supply uint u0)
(define-data-var token-uri (optional (string-utf8 256)) TOKEN-URI)

;; Authorized minters (prediction market contract)
(define-map authorized-minters principal bool)

;; =============================================
;; SIP-010 IMPLEMENTATION
;; =============================================

;; Transfer tokens
(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
  (begin
    (asserts! (is-eq tx-sender sender) ERR-NOT-TOKEN-OWNER)
    (try! (ft-transfer? prediction-token amount sender recipient))
    (match memo to-print (print to-print) 0x)
    (ok true))
)

;; Get token name
(define-read-only (get-name)
  (ok TOKEN-NAME)
)

;; Get token symbol
(define-read-only (get-symbol)
  (ok TOKEN-SYMBOL)
)

;; Get decimals
(define-read-only (get-decimals)
  (ok TOKEN-DECIMALS)
)

;; Get balance
(define-read-only (get-balance (who principal))
  (ok (ft-get-balance prediction-token who))
)

;; Get total supply
(define-read-only (get-total-supply)
  (ok (var-get total-supply))
)

;; Get token URI
(define-read-only (get-token-uri)
  (ok (var-get token-uri))
)

;; =============================================
;; TOKEN DEFINITION
;; =============================================

(define-fungible-token prediction-token MAX-SUPPLY)

;; =============================================
;; MINT/BURN FUNCTIONS
;; =============================================

;; Mint tokens (only by authorized contracts/owner)
(define-public (mint (amount uint) (recipient principal))
  (begin
    (asserts! (or (is-eq tx-sender CONTRACT-OWNER) 
                  (default-to false (map-get? authorized-minters tx-sender))) 
              ERR-NOT-AUTHORIZED)
    (asserts! (<= (+ (var-get total-supply) amount) MAX-SUPPLY) ERR-NOT-AUTHORIZED)
    (var-set total-supply (+ (var-get total-supply) amount))
    (ft-mint? prediction-token amount recipient))
)

;; Burn tokens
(define-public (burn (amount uint) (owner principal))
  (begin
    (asserts! (is-eq tx-sender owner) ERR-NOT-TOKEN-OWNER)
    (var-set total-supply (- (var-get total-supply) amount))
    (ft-burn? prediction-token amount owner))
)

;; =============================================
;; ADMIN FUNCTIONS
;; =============================================

;; Add authorized minter
(define-public (add-minter (minter principal))
  (begin
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-NOT-AUTHORIZED)
    (ok (map-set authorized-minters minter true)))
)

;; Remove authorized minter
(define-public (remove-minter (minter principal))
  (begin
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-NOT-AUTHORIZED)
    (ok (map-delete authorized-minters minter)))
)

;; Check if minter is authorized
(define-read-only (is-minter (who principal))
  (default-to false (map-get? authorized-minters who))
)

;; Set token URI
(define-public (set-token-uri (new-uri (optional (string-utf8 256))))
  (begin
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-NOT-AUTHORIZED)
    (ok (var-set token-uri new-uri)))
)

;; =============================================
;; REWARD DISTRIBUTION
;; =============================================

;; Reward users for participating (to be called by prediction market contract)
(define-public (reward-participant (recipient principal) (amount uint))
  (begin
    (asserts! (or (is-eq tx-sender CONTRACT-OWNER)
                  (default-to false (map-get? authorized-minters tx-sender)))
              ERR-NOT-AUTHORIZED)
    (mint amount recipient))
)

;; Batch reward multiple users
(define-public (batch-reward (recipients (list 50 { user: principal, amount: uint })))
  (begin
    (asserts! (or (is-eq tx-sender CONTRACT-OWNER)
                  (default-to false (map-get? authorized-minters tx-sender)))
              ERR-NOT-AUTHORIZED)
    (ok (map reward-single recipients)))
)

(define-private (reward-single (recipient { user: principal, amount: uint }))
  (mint (get amount recipient) (get user recipient))
)
