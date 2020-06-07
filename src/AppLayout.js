export default {
  innerBorderWidth: "1px",
  borderWidth: "1px",
  tradePanelWidth: "260px",

  orderBookWidth: "260px",
  tradeHistoryWidth: "225px",

  sidePadding: "12px",
  topNavBarHeight: "56px",
  tickerBarHeight: "45px",
  mainScreenHeight: "calc(100vh - 56px - 52px)", // consider border width

  // nav bar level 1: 56px
  // nav bar level 2: 53px
  // tab: 44px
  // table header: 32px
  // pagination: 32px
  tradeOrderAndTradeHeight: "calc(50vh - 56px - 52px - 44px)",
  tradeOrderBaseTableHeightNoPagination:
    "calc(50vh - 56px - 52px - 44px - 44px)",
  tradeOrderBaseTableHeight: "calc(50vh - 56px - 52px - 44px - 44px - 32px)",

  tradeOrderBaseTableScrollYNoPagination:
    "calc(50vh - 56px - 52px - 44px - 44px - 32px)",

  tradeOrderBaseTableScrollY:
    "calc(50vh - 56px - 52px - 44px - 44px - 32px - 32px)",

  simpleSecondaryPageHeight: "calc(100vh - 56px)",
  modalWidth: "536px",
};
