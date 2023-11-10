import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const UserContext = createContext({});

// eslint-disable-next-line react/prop-types
export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        // https://blog.bitsrc.io/api-call-in-react-using-axios-handling-complicated-scenarios-befff1655abc
        const res = await axios.get('/users/me');
        const user = res.data.data.user;
        setUser(user);
      } catch(err) {
        console.error(err);
      }
    })();
  }, []);

  return (
    <UserContext.Provider value={{user, setUser}}>
      { children }
    </UserContext.Provider>
  );
}