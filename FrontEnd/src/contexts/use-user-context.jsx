import PropTypes from 'prop-types';
import { useMemo, useState, useContext, createContext } from 'react';

// ----------------------------------------------------------------------

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [userData, setUserData] = useState({});

  const contextValue = useMemo(
    () => ({
      userData,
      setUserData,
    }),
    [userData, setUserData]
  );
  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
};

export const useUserContext = () => useContext(UserContext);

UserContextProvider.propTypes = {
  children: PropTypes.node,
  userData: PropTypes.shape({
    role: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
  }),
};
