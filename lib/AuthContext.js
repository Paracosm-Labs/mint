import { createContext, useContext, useState } from "react";

// Create a context with a default value for authentication
const AuthContext = createContext({
  isAuthenticated: false,
  jwtToken: null,
  setIsAuthenticated: (isAuth) => {},
  setJwtToken: (token) => {},
  data: null,
  setData: (data) => {},
});

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [jwtToken, setJwtToken] = useState(null);
  const [data, setData] = useState(null);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        jwtToken,
        setJwtToken,
        data,
        setData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);
