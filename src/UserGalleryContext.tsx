import { createContext, useContext, useEffect, useState } from "react";
import type { UserAvatarScale } from "../types/user";

const UserGalleryDataContext = createContext({
  userAvatarScales: [] as UserAvatarScale[],
  // setUserAvatarScales: ([]: UserAvatarScale[]) => {},
});

type Actions = { type: "update" };

const delay = async (ms: number | undefined) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

type UserGalleryProvider = {
  children: React.ReactNode;
};
export const UserGalleryDataProvider = ({ children }: UserGalleryProvider) => {
  const [userAvatarScales, setUserAvatarScales] = useState(
    [] as UserAvatarScale[]
  );

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch("/users/avatars");
      const result = await res.json();

      setUserAvatarScales(result);
    };

    fetchUsers();
  }, []);

  const value = {
    userAvatarScales,
    // setUserAvatarScales,
  };

  return (
    <UserGalleryDataContext.Provider value={value}>
      {children}
    </UserGalleryDataContext.Provider>
  );
};

export const useGalleryContext = () => useContext(UserGalleryDataContext);
