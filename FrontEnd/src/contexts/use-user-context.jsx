import PropTypes from 'prop-types';
import { jwtDecode } from "jwt-decode";
import {useMemo, useState, useEffect, useContext, createContext} from 'react';

// ----------------------------------------------------------------------

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [userData, setUserData] = useState({});

  useEffect(() => {
    if(userData !== null && Object.keys(userData).length === 0){
      const token = localStorage.getItem('WDAI_Project_token');
      if (token) {
        const decoded = jwtDecode(token);
        setUserData(decoded);
      }
    }
  }, [userData]);


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

