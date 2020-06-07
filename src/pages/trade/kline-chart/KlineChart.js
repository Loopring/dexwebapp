import { connect } from "react-redux";
import { dispose, init } from "klinecharts";
import { withUserPreferences } from "components/UserPreferenceContext";

import React, { PureComponent } from "react";
import config from "lightcone/config";
import styled, { withTheme } from "styled-components";

import "./KlineChart.less";
import { getData } from "./utils";

const Span = styled.span`
  font-size: 11.2px;
  display: inline-block;
  padding: 0 8px;
  color: ${(props) => props.theme.textDim};
  cursor: pointer;
  &:hover {
    color: ${(props) => props.theme.textDim};
  }
`;

const PeriodSelected = styled(Span)`
  color: ${(props) => props.theme.primary} !important;
  font-weight: bold;
`;

const Select = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 30px;
  cursor: pointer;
  span {
    padding: 0;
  }
`;

const SelectArrow = styled.i`
  border-left: solid 4px transparent;
  border-right: solid 4px transparent;
  border-top: solid 4px ${(props) => props.theme.textDim};
  transition: all 0.2s;
  transform-origin: center center;
`;

const SelectDropdownRow = styled.li`
  display: flex;
  cursor: pointer;
  flex-direction: row;
  align-items: center;
  padding-left: 6px;
  height: 28px;
  line-height: 28px;
  font-size: 12px;
  color: ${(props) => props.theme.textDim};
  &:hover {
    color: ${(props) => props.theme.textWhite};
    background-color: ${(props) => props.theme.background};
  }
`;

const periods = [
  {
    label: "Line",
    value: "Line",
  },
  // {
  //   label: '1m',
  //   value: '1min',
  // },
  {
    label: "5m",
    value: "5min",
  },
  {
    label: "15m",
    value: "15min",
  },
  {
    label: "30m",
    value: "30min",
  },
  {
    label: "1H",
    value: "1hr",
  },
  {
    label: "2H",
    value: "2hr",
  },
  {
    label: "4H",
    value: "4hr",
  },
  {
    label: "12H",
    value: "12hr",
  },
  {
    label: "1D",
    value: "1d",
  },
  // {
  //   label: '1W',
  //   value: '1w'
  // }
];

class KlineChart extends PureComponent {
  constructor(props) {
    super(props);

    this.onResize = (resetPosition) => {
      if (this.kLineChart) {
        this.setKlineChartStyles(resetPosition);
      }
    };

    this.state = {
      currentPeriod: {
        label: "1H",
        value: "1hr",
      },
      currentCandleStickTechnicalIndicatorType: "MA",
      noData: false,
    };
  }

  componentDidMount() {
    this.initKlineChart();
    if (this.props.exchange.isInitialized) {
      this.initData();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.exchange.isInitialized &&
      this.props.exchange.isInitialized !== prevProps.exchange.isInitialized
    ) {
      this.initData();
    }

    if (
      this.props.exchange.isInitialized &&
      prevProps.currentMarket.current !== this.props.currentMarket.current &&
      this.props.currentMarket.current
    ) {
      // Empty data.
      this.kLineChart.applyNewData([], true);

      // Query new data since the market pair is changed.
      this.onResize(true);
      this.applyNewData(this.state.currentPeriod);
    }

    if (
      this.props.exchange.isInitialized &&
      prevProps.theme !== this.props.theme
    ) {
      this.onResize(false);
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.onResize);
    if (this.loadMoreDataTimer) {
      clearTimeout(this.loadMoreDataTimer);
    }
    this.clearUpdateDataTimer();
    dispose("k-line-chart");
  }

  initKlineChart() {
    this.kLineChart = init("k-line-chart");
    window.addEventListener("resize", this.onResize);

    // Add a technical indicator
    this.kLineChart.setTechnicalIndicatorParams("VOL", []);
    // Set height here!
    this.kLineChart.addTechnicalIndicator("VOL", 50);

    this.setKlineChartStyles();
  }

  initData() {
    this.kLineChart.loadMore((timestamp) => {
      this.applyMoreData(timestamp);
    });

    this.setKlineChartStyles(true);
    this.applyNewData(this.state.currentPeriod);

    setTimeout(() => {
      this.onResize();
    }, 200);
  }

  setKlineChartStyles(resetPosition) {
    const { theme, currentMarket, exchange } = this.props;

    const baseTokenSymbol = currentMarket.baseTokenSymbol;
    const baseToken = config.getTokenBySymbol(baseTokenSymbol, exchange.tokens);
    const marketConfig = config.getMarketByPair(
      currentMarket.current,
      exchange.markets
    );
    const precisionForPrice = marketConfig ? marketConfig.precisionForPrice : 8;

    // 加载精度
    this.kLineChart.setPrecision(
      precisionForPrice,
      baseToken.precision > 2 ? 2 : baseToken.precision
    );

    let yAxisMaxWidth = 100;
    let yAxisMinWidth = 60;
    if (precisionForPrice === 8) {
      yAxisMaxWidth = 120;
      yAxisMinWidth = 80;
    }

    // Style configuration details:
    // https://github.com/liihuu/KLineChart/blob/master/STYLE-CONFIG-DETAIL.md
    this.kLineChart.setStyleOptions({
      grid: {
        horizontal: {
          display: true,
          color: theme.background,
        },
        vertical: {
          display: true,
          color: theme.background,
        },
      },
      candleStick: {
        bar: {
          style: "solid",
          upColor: theme.upColor,
          downColor: theme.downColor,
          noChangeColor: theme.upColor,
        },
        priceMark: {
          high: {
            color: "transparent", // theme.upColor,
          },
          low: {
            color: "transparent", // theme.downColor,
          },
          last: {
            upColor: theme.upColor,
            downColor: theme.downColor,
            noChangeColor: theme.upColor,
            text: {
              paddingLeft: 6,
              paddingRight: 6,
              paddingTop: 4,
            },
          },
        },
      },
      xAxis: {
        maxHeight: 50,
        minHeight: 30,
        axisLine: {
          color: theme.background,
        },
        tickText: {
          color: theme.textDim,
        },
        tickLine: {
          color: theme.background,
        },
      },
      yAxis: {
        maxWidth: yAxisMaxWidth,
        minWidth: yAxisMinWidth,
        axisLine: {
          color: theme.background,
        },
        tickText: {
          color: theme.textDim,
        },
        tickLine: {
          length: 3,
          color: theme.background,
        },
      },
      separator: {
        color: theme.background,
      },
      floatLayer: {
        crossHair: {
          horizontal: {
            line: {
              color: theme.textDim,
            },
            text: {
              paddingLeft: 6,
              paddingRight: 6,
              paddingTop: 4,
            },
          },
          vertical: {
            line: {
              color: theme.textDim,
            },
            text: {
              paddingLeft: 6,
              paddingRight: 6,
              paddingTop: 4,
            },
          },
        },
        prompt: {
          displayRule: "always",
          candleStick: {
            showType: "standard",
            labels:
              this.props.userPreferences.language === "zh"
                ? ["  时间", "开", "收", "高", "低"]
                : ["  Time", "O", "C", "H", "L"],
            text: {
              size: 11.2,
              color: theme.textDim,
              marginBottom: 200, // doesn't work
            },
          },
          technicalIndicator: {
            text: {
              size: 11.2,
              color: theme.textDim,
              marginLeft: 14,
              marginTop: 6,
            },
          },
        },
      },
      technicalIndicator: {
        bar: {
          upColor: theme.upColor + "B0",
          downColor: theme.downColor + "B0",
          noChangeColor: theme.upColor + "B0",
        },
        line: {
          // Colors used in MA
          colors: [
            theme.textWhite,
            theme.orange,
            "#F601FF",
            theme.primary,
            "#1e88e5",
          ],
        },
      },
    });

    // 初始化-设置右边间距
    if (resetPosition) {
      this.resetChartPosition();
    }
  }

  resetChartPosition() {
    this.kLineChart.setOffsetRightSpace(0);

    if (["12hr", "1d", "1w"].includes(this.state.currentPeriod.value)) {
      this.kLineChart.setDataSpace(30);
    } else {
      this.kLineChart.setDataSpace(10);
    }
    this.kLineChart.resize();
  }

  applyNewData(period) {
    this.clearUpdateDataTimer();
    (async () => {
      const dataList = await getData(
        this.props.exchange.tokens,
        this.props.currentMarket.current,
        period.value
      );
      if (dataList === null || (dataList !== null && dataList.length === 0)) {
        this.kLineChart.applyNewData([], true);
        this.setState({
          noData: true,
        });
        return;
      }

      if (dataList.length === 0) {
        this.setState({
          noData: true,
        });
      }

      this.kLineChart.applyNewData(dataList, true);
      // Reset the position of chart
      this.resetChartPosition();

      // this.updateLatestData(period);
    })();
  }

  applyMoreData(timestamp) {
    if (this.state.noData) {
      return;
    }

    (async () => {
      const period = this.state.currentPeriod;
      const dataList = await getData(
        this.props.exchange.tokens,
        this.props.currentMarket.current,
        period.value,
        timestamp
      );
      if (dataList === null || (dataList !== null && dataList.length === 0)) {
        this.setState({
          noData: true,
        });
        return;
      }

      if (dataList.length === 0) {
        this.setState({
          noData: true,
        });
      }

      this.kLineChart.applyMoreData(dataList, true);
    })();
  }

  // TODO: add latest data
  updateLatestData(period) {
    console.log("updateData");
  }

  clearUpdateDataTimer() {
    if (this.updateDataTimer) {
      clearTimeout(this.updateDataTimer);
    }
  }

  changePeriod = (period) => () => {
    const { currentPeriod } = this.state;
    // When the period is line, set the chart as a line chart, the other is a candle chart
    if (currentPeriod !== period) {
      if (period.value === "Line") {
        this.kLineChart.setCandleStickChartType("real_time");
      } else if (currentPeriod.value === "Line") {
        this.kLineChart.setCandleStickChartType("candle_stick");
      }
      // Set the data of different periods after switching the period
      if (period.value !== "Line") {
        this.applyNewData(period);
      }

      this.setState({
        currentPeriod: period,
      });
    }
  };

  render() {
    const {
      currentPeriod,
      currentCandleStickTechnicalIndicatorType,
    } = this.state;

    return (
      <div className="kline-chart">
        <div className="period-container">
          {periods.map((period) => {
            let label = period.label;
            if (
              this.props.userPreferences.language === "zh" &&
              period.value === "Line"
            ) {
              label = "分时";
            }
            return currentPeriod.value === period.value ? (
              <PeriodSelected
                key={period.value}
                onClick={this.changePeriod(period)}
              >
                {label}
              </PeriodSelected>
            ) : (
              <Span key={period.value} onClick={this.changePeriod(period)}>
                {label}
              </Span>
            );
          })}
          <div className="select-container">
            <Select>
              <Span
                style={{
                  paddingRight: "4px",
                }}
              >
                {currentCandleStickTechnicalIndicatorType}
              </Span>
              <SelectArrow className="select-arrow" />
            </Select>
            <ul
              className="select-drop-down-container"
              style={{
                backgroundColor: this.props.theme.background,
              }}
            >
              {["MA", "BOLL", "SAR", "NO"].map((type) => {
                return (
                  <SelectDropdownRow
                    key={type}
                    onClick={() => {
                      this.setState({
                        currentCandleStickTechnicalIndicatorType: type,
                      });
                      this.kLineChart.setCandleStickTechnicalIndicatorType(
                        type
                      );
                    }}
                  >
                    <span style={{ paddingLeft: 0 }}>{type}</span>
                  </SelectDropdownRow>
                );
              })}
            </ul>
          </div>
        </div>
        <div className="app-content">
          <div className="k-line-chart-container">
            <div id="k-line-chart" style={{ height: "100%" }} />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { currentMarket, exchange } = state;
  return {
    currentMarket,
    exchange,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default withUserPreferences(
  withTheme(connect(mapStateToProps, mapDispatchToProps)(KlineChart))
);
