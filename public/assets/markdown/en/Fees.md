
# Fee Schedule


## Request Processing Fees

| Type    | Fee |
|:------------- |---------------:|
| Layer-2 Activiation      |         0 ETH|
| Layer-2 Keypair Reset      |         0 ETH |
| Deposit |             0 ETH |
| Withdrawal |           0.020 ETH |


- The current version of the Loopring protocol can only support up to 1 million users for each exchange (to reduce Zero-Knowledge proof cost).
- The Loopring protocol requires us to process every user request, including layer-2 activation, layer-2 keypair reset, deposits, and withdrawals. We charge fees to cover Zero-Knowledge proof cost and Ethereum transaction gas fee to avoid Sybil attack.

- Note: all these requests happen 'outside' the zkRollup, trying to enter or exit the layer-2 environment. Once you’re 'inside' and trading, everything happens instantly and without explicit Ethereum transaction fees (only trading fees, if applicable).


## Trading Fees

| Type    | Maker Fee| Taker Fee|
|:------------- |---------------:| -------------: |
| All  Pairs       |         <mark>0%</mark>| 0.20% |


- For each settlement, we pay a protocol fee, currently 0.06% of the tokens/ether the taker order bought, to Loopring's <a href="https://etherscan.io/address/feevault.lrctoken.eth#tokentxns" target="_blank"> Fee Vault </a> to reward those who have <a href="https://etherscan.io/address/stakingpool.lrctoken.eth" target="_blank"> staked </a> LRC tokens for at least 90 days.


- Makers are those who have limit orders that rest on the order book. Takers are those who fill (remove) orders from the order book. Makers receive a rebate of 8% of the trading fee on their filled orders. For example: if a taker fills an order and pays the default 0.2% trading fee, the maker who's order was filled receives 0.016% (1.6 bps) of the value of that trade. These rewards accrue daily and are paid out monthly to the maker's Loopring Exchange account. You can see this on the 'Maker & Referral Rewards" tab.


### Discount

The following fee discounts are available based on your 30-day total trading volume and your exchange account's 30-day average LRC balance.


| Level    | Volume| | LRC Balance |  Maker Fee | Taker Fee |
|:------------- |---------------:| :-------------: |---------------:|---------------:|---------------:|
| Default       |-||-|<mark>0%</mark>|0.20%|
| VIP 1       |300 ETH|OR|10,000 LRC|<mark>0%</mark>|0.17%|
| VIP 2       |3,000 ETH|AND|100,000 LRC|<mark>0%</mark>|0.13%|
| VIP 3       |30,000 ETH|AND|500,000 LRC|<mark>0%</mark>|0.10%|
| VIP 4       |60,000 ETH|AND|1,000,000 LRC|<mark>0%</mark>|0.06%|
| Honor VIP       ||||<mark>0%</mark>|0.06%|

- Market makers who do consistent and substantial volume on the venue and are interested in earning rebates above the standard 8% of trading fees, please contact [exchange@loopring.io](mailto:exchange@loopring.io).


## Future Changes

We reserve the right to change our fee schedule. To be notified, please <a href="https://twitter.com/loopringorg">follow us on twitter</a>. We will always notify of fee changes, but some users may not see it.

