import { Layout } from 'antd';
import { Scroller } from 'styles/Styles';
import { connect } from 'react-redux';
import AppLayout from 'AppLayout';

import { withUserPreferences } from 'components/UserPreferenceContext';
import React from 'react';
import ReactMarkdown from 'react-markdown/with-html';
import styled, { withTheme } from 'styled-components';

const { Content, Sider } = Layout;

const MarkdownWrapper = styled.div`
  padding: 64px 40px 0 40px;
  font-family: Montserrat, sans-serif;
  color: ${(props) => props.theme.textWhiteBulk};
  font-size: 1rem;

  h1,
  h2,
  h3,
  h4 {
    font-weight: 600;
    color: ${(props) => props.theme.textWhite};
  }
  h1 {
    padding-top: 20px;
    font-size: 36px;
    text-transform: uppercase;
    margin-bottom: 2rem;
    color: ${(props) => props.theme.textBright};
  }
  h2 {
    text-transform: uppercase;
    font-size: 26px;
    margin-top: 2.4rem;
    color: ${(props) => props.theme.primary};
  }
  h3 {
    margin-top: 2rem;
    font-size: 18px;
    color: ${(props) => props.theme.textWhite};
  }

  blockquote {
    color: ${(props) => props.theme.textDim};
    font-style: italic;
    border-left: 2px solid ${(props) => props.theme.textDim}!important;
    padding: 4px 16px 4px 16px;
  }

  mark {
    background: transparent;
    color: ${(props) => props.theme.green};
  }

  pre {
    font-family: monospace !important;
    color: ${(props) => props.theme.textWhite};
    background: ${(props) => props.theme.sidePanelBackground};
    border-radius: 4px;
    font-size: 0.85rem;
    padding: 16px 8px;
  }

  hr {
    margin: 16px 0;
    border-color: ${(props) => props.theme.sidePanelBackground};
  }

  img {
    max-width: 640px;
  }

  table {
    background: ${(props) => props.theme.foreground};
    margin: 24px auto;
    margin-bottom: 24px !important;
    font-size: 0.9rem;
    min-width: 100%;
  }

  thead {
    background: ${(props) => props.theme.tableHeaderBackground};
  }

  thead > tr > th {
    color: ${(props) => props.theme.textDim};
    font-weight: normal;
  }

  tbody {
    min-width: 80%;
    border: 1px solid ${(props) => props.theme.border};
  }

  td,
  th {
    padding: 8px 12px;
  }

  tr {
    border-bottom: 1px solid ${(props) => props.theme.border};
  }

  tbody > tr:hover > td {
    color: ${(props) => props.theme.textBright};
    background: ${(props) => props.theme.lightForeground};
  }

  td {
    color: ${(props) => props.theme.textWhite};
  }

  ul,
  ol {
    padding-inline-start: 18px;
  }
`;

class MakrdownPage extends React.Component {
  state = {
    markdown: '',
    loading: true,
  };

  fetchMarkdown() {
    const url = `/assets/markdown/${this.props.userPreferences.language}/${this.props.fileName}`;
    fetch(url)
      .then((r) => r.text())
      .then((text) => {
        this.setState({
          markdown: text,
          loading: false,
        });
      });
  }

  componentDidMount() {
    this.fetchMarkdown();
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.userPreferences.language !== this.props.userPreferences.language
    ) {
      this.fetchMarkdown();
    }
  }

  getContainerBackground() {
    return this.state.loading
      ? `url(/assets/images/${this.props.theme.imgDir}/bars.svg) center center no-repeat`
      : 'none';
  }

  render() {
    const theme = this.props.theme;
    return (
      <div>
        <Layout
          hasSider
          style={{
            height: AppLayout.simpleSecondaryPageHeight,
          }}
        >
          <Sider
            width={AppLayout.tradePanelWidth}
            style={{
              padding: '0px',
              background: theme.sidePanelBackground,
              borderStyle: 'none',
            }}
            trigger={null}
            breakpoint="sm"
            collapsedWidth="0"
          >
            <Scroller
              style={{
                borderTop: '1px solid ' + theme.seperator,
              }}
            >
              {this.props.navigation}
            </Scroller>
          </Sider>
          <Content
            width="100%"
            style={{
              backgroundColor: theme.background,
              borderLeftStyle: 'none',
            }}
          >
            <div
              style={{
                marginLeft: 'auto',
                marginRight: 'auto',
                width: '740px',
                height: '100%',
                background: this.getContainerBackground(),
                backgroundSize: '40px 40px',
              }}
            >
              <MarkdownWrapper>
                <ReactMarkdown
                  escapeHtml={false}
                  source={this.state.markdown}
                />
              </MarkdownWrapper>
            </div>
          </Content>
        </Layout>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

export default withUserPreferences(
  withTheme(connect(mapStateToProps, null)(MakrdownPage))
);
