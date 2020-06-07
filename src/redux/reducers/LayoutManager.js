import { UPDATE_COLUMNS } from "redux/actions/LayoutManager";

const initialState = {
  numColumns: 4,
};

export const LayoutManagerReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_COLUMNS:
      const numColumns = getNumColumns();
      return {
        ...state,
        numColumns,
      };
    default:
      return state;
  }
};

/*
{
  xs: '480px',
  sm: '576px',
  md: '768px',
  lg: '992px',
  xl: '1200px',
  xxl: '1600px',
}
*/
function getNumColumns() {
  const innerWidth = window.innerWidth;
  if (innerWidth >= 1600) {
    return 4;
  } else if (innerWidth >= 992 && innerWidth < 1600) {
    return 3;
  } else if (innerWidth >= 576 && innerWidth < 992) {
    return 2;
  } else {
    return 1;
  }
}
