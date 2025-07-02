import { createContext, useState } from "react";
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
  const value = {
    userAvatarScales,
    setUserAvatarScales,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
};
