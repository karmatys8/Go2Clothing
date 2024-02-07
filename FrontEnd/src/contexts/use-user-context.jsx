import PropTypes from 'prop-types';
import { jwtDecode } from 'jwt-decode';
import { useMemo, useState, useEffect, useContext, createContext } from 'react';

// ----------------------------------------------------------------------

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [userData, setUserData] = useState(() => {
    const token = localStorage.getItem('WDAI_Project_token');
    if (token) {
      const decoded = jwtDecode(token);
      return decoded;
    }
    return {};
  });

  useEffect(() => {
    const token = localStorage.getItem('WDAI_Project_token');
    if (token) {
      const decoded = jwtDecode(token);
      setUserData(decoded);
    }
  }, []);

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
