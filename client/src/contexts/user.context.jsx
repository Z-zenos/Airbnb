import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if(!user) {
      axios.get('/user/profile').then((res) => {
        setUser(res.data.data.user);
      }).catch(err => console.log(err));
    }
  }, []);

  return (
    <UserContext.Provider value={{user, setUser}}>
      { children }
    </UserContext.Provider>
  );
}