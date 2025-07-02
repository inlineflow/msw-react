import { createContext, useContext, useEffect, useState } from "react";
import type { UserAvatarScale } from "../types/user";

const Context = createContext({
  userAvatarScales: [] as UserAvatarScale[],
  setUserAvatarScales: ([]: UserAvatarScale[]) => {},
});

type UserGalleryProvider = {
  children: React.ReactNode;
};
export const UserGalleryProvider = ({ children }: UserGalleryProvider) => {
  const [userAvatarScales, setUserAvatarScales] = useState(
    [] as UserAvatarScale[]
  );

  useEffect(() => {
    const fetchUsers = async () => {
      console.log("Starting request");
      const res = await fetch("/users/avatars");
      const result = await res.json();

      setUserAvatarScales(result);
    };

    fetchUsers();
  }, []);

  const value = {
    userAvatarScales,
    setUserAvatarScales,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useGalleryContext = () => useContext(Context);
