import { Select } from 'antd';
import I from 'components/I';
import React, { useContext, useState } from 'react';
import styled, { ThemeContext } from 'styled-components';

const SelectDiv = styled.div`
  .ant-select-selector {
    border-radius: 12px !important;
    color: ${(props) => props.theme.textWhite}!important;
    background-color: ${(props) => props.theme.foreground}!important;
    border: 1px solid ${(props) => props.theme.inputBorderColor} !important;
    font-size: 1.2rem;
    height: 48px !important;
    display: flex;
    align-items: center;
  }

  .ant-select-single.ant-select-lg:not(.ant-select-customize-input):not(.ant-select-customize-input)
    .ant-select-selection-search-input {
    height: 46px !important;
  }

  .ant-select-focused.ant-select-single:not(.ant-select-customize-input)
    .ant-select-selector {
    box-shadow: none !important;
  }

  .ant-select-single.ant-select-lg:not(.ant-select-customize-input)
    .ant-select-selector {
    padding: 0 18px;
  }

  .ant-select-show-search.ant-select-single:not(.ant-select-customize-input)
    .ant-select-selector
    input {
    cursor: pointer !important;
  }

  .ant-select-arrow {
    color: ${(props) => props.theme.textWhite}!important;
    right: 18px;
  }

  .ant-select-selection-item {
    height: 40px;
  }
`;

export const AssetSelectMenuItemStyled = styled.div`
  color: ${(props) => props.theme.textDim}!important;
  background-color: ${(props) => props.theme.foreground};
  font-size: 1rem;
  height: 52px;
  display: flex;
  align-items: center;
  padding: 0 9px;
  margin: 0 9px;
  cursor: pointer;
  &:hover {
    background-color: ${(props) => props.theme.foreground} !important;
    // color: ${(props) => props.theme.textWhite} !important;

    span {
      color: ${(props) => props.theme.textWhite}!important;
    }
  }

  border-bottom: 1px solid ${(props) => props.theme.inputBorderColor};

  span {
    color: ${(props) => props.theme.textDim}!important;
    // font-size: 1rem !important;
    // margin-left: 12px !important;
  }
`;

const SelectStyled = styled(Select)`
  max-height: 260px;
  overflow-y: scroll;
`;

const DropdownRenderStyled = styled.div`
  height: 444px;
  overflow-y: scroll;

  div:last-of-type {
    border-bottom: none;
  }
`;

const AssetSelect = ({ options, noDataText, value }) => {
  const theme = useContext(ThemeContext);
  const [searchText, setSearchText] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  function onChange(value) {
    console.log('onChange', value);
  }

  function onSearch(val) {
    setSearchText(val);
  }

  let fileredOptions = [];
  if (dropdownOpen) {
    // Use dropdownOpen here to avoid a wired animation.
    if (searchText && searchText.length > 0) {
      fileredOptions = options.filter((option) =>
        option.props.searchValue
          .toLowerCase()
          .includes(searchText.toLowerCase())
      );
    } else {
      fileredOptions = options;
    }

    if (fileredOptions.length === 0) {
      fileredOptions = (
        <AssetSelectMenuItemStyled>
          <span
            style={{
              textAlign: 'center',
              color: theme.textDim,
            }}
          >
            <I s={noDataText} />
          </span>
        </AssetSelectMenuItemStyled>
      );
    }
  }

  return (
    <SelectDiv
      onMouseDown={() => {
        setDropdownOpen(!dropdownOpen);
      }}
      onBlur={() => {
        setDropdownOpen(false);
      }}
    >
      <SelectStyled
        size={'large'}
        showSearch
        open={dropdownOpen}
        style={{ width: '100%' }}
        value={value}
        placeholder=""
        // onBlur={onBlur}
        onChange={onChange}
        onSearch={onSearch}
        dropdownStyle={{
          borderRadius: '12px',
          backgroundColor: theme.foreground,
          filter: 'drop-shadow(2px 6px 6px rgba(0, 0, 0, 0.4))',
          paddingBottom: '0px',
        }}
        dropdownRender={(menu) => (
          <DropdownRenderStyled>{fileredOptions}</DropdownRenderStyled>
        )}
      >
        {fileredOptions}
      </SelectStyled>
    </SelectDiv>
  );
};

export default AssetSelect;
