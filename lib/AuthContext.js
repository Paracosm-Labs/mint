// import { createContext, useContext, useState } from "react";

// // Create a context with a default value for authentication
// const AuthContext = createContext({
//   isAuthenticated: false,
//   jwtToken: null,
//   setIsAuthenticated: (isAuth) => {},
//   setJwtToken: (token) => {},
//   data: null,
//   setData: (data) => {},
// });

// export const AuthProvider = ({ children }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [jwtToken, setJwtToken] = useState(null);
//   const [data, setData] = useState(null);

//   return (
//     <AuthContext.Provider
//       value={{
//         isAuthenticated,
//         setIsAuthenticated,
//         jwtToken,
//         setJwtToken,
//         data,
//         setData,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };
// // Custom hook to use the AuthContext
// export const useAuth = () => useContext(AuthContext);


import { createContext, useContext, useState, useEffect } from "react";

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

  // Persist authentication state with localStorage
  useEffect(() => {
    const storedAuth = localStorage.getItem("isAuthenticated");
    const storedToken = localStorage.getItem("jwtToken");
    const storedData = localStorage.getItem("data");

    if (storedAuth === "true") {
      setIsAuthenticated(true);
      if (storedToken) setJwtToken(storedToken);
      if (storedData) setData(JSON.parse(storedData));
    }
  }, []);

  // Save authentication state to localStorage when changed
  useEffect(() => {
    localStorage.setItem("isAuthenticated", isAuthenticated);
    if (jwtToken) {
      localStorage.setItem("jwtToken", jwtToken);
    } else {
      localStorage.removeItem("jwtToken");
    }

    if (data) {
      localStorage.setItem("data", JSON.stringify(data));
    } else {
      localStorage.removeItem("data");
    }
  }, [isAuthenticated, jwtToken, data]);

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
