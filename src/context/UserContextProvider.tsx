import { createContext, useContext, useEffect, useState } from "react";
import { User, Users } from "../Types";
import { supabase } from "../supabase-client";

interface UserContextProviderType {
  children: React.ReactNode;
}
interface UserContextType {
  user: User | null;
  token: string | null;
  users: Users;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setUsers: (users: Users) => void;
}

const UserContext = createContext<UserContextType>({
  user: null,
  token: null,
  users: [],
  setUser: () => {},
  setToken: () => {},
  setUsers: () => {},
});

export const UserContextProvider = ({ children }: UserContextProviderType) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<Users>([]);
  const [token, _setToken] = useState(localStorage.getItem("ACCESS_TOKEN"));

  const fetchUsers = async () => {
    const { error, data } = await supabase.from("users").select("*");
    if (error) {
      console.error(error);
      return;
    }
    if (data) {
      setUsers(data!);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const setToken = (token: string | null) => {
    // console.log("Setting token in localStorage:", token); // Debug log
    _setToken(token);
    if (token) {
      localStorage.setItem("ACCESS_TOKEN", token);
      // console.log("Token stored in localStorage:", token); // Debug log
    } else {
      localStorage.removeItem("ACCESS_TOKEN");
      // console.log("Token removed from localStorage"); // Debug log
    }
  };
  return (
    <UserContext.Provider
      value={{ user, token, users, setUser, setToken, setUsers }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
