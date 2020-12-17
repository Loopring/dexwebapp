import React from 'react';

const UserPreferenceContext = React.createContext();

const withUserPreferences = (Component) => {
  return function contextComponent(props) {
    return (
      <UserPreferenceContext.Consumer>
        {(context) => <Component {...props} userPreferences={context} />}
      </UserPreferenceContext.Consumer>
    );
  };
};

export default UserPreferenceContext;
export { withUserPreferences };
