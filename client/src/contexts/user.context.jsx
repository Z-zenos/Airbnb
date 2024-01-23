import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export const UserContext = createContext({});

const unauthorizedRoutes = ['review-account', 'login'];

// eslint-disable-next-line react/prop-types
export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    (async () => {
      try {
        if(!unauthorizedRoutes.some(route => location.pathname.includes(route))) {
          // https://blog.bitsrc.io/api-call-in-react-using-axios-handling-complicated-scenarios-befff1655abc
          const res = await axios.get('/users/me', {
            withCredentials: true,
          });
          const user = res.data.data.user;
          setUser(user);
        }
      } catch(err) { /* empty */ }
    })();
  }, []);

  return (
    <UserContext.Provider value={{user, setUser}}>
      { children }
    </UserContext.Provider>
  );
}