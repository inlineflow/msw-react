import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import type { UserAvatarScale } from "../types/user";

type State = {
  userAvatarScales: UserAvatarScale[];
  userAchievements: string[];
};

type API = {
  onUpdateUserAvatarScales: (scales: UserAvatarScale[]) => void;
  onUpdateUserAchievements: (achievements: string[]) => void;
};

const UserGalleryDataContext = createContext({} as State);
const UserGalleryAPIContext = createContext({} as API);

type Actions =
  | { type: "updateUserAvatarScales"; scales: UserAvatarScale[] }
  | { type: "updateUserAchievements"; achievements: string[] };

const reducer = (state: State, action: Actions): State => {
  switch (action.type) {
    case "updateUserAvatarScales":
      return { ...state, userAvatarScales: action.scales };
    case "updateUserAchievements":
      return { ...state, userAchievements: action.achievements };
  }
};

type Provider = {
  children: React.ReactNode;
};
export const UserGalleryDataProvider = ({ children }: Provider) => {
  const [state, dispatch] = useReducer(reducer, {} as State);
  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch("/users/avatars");
      const result = await res.json();

      dispatch({ type: "updateUserAvatarScales", scales: result });
    };

    fetchUsers();
  }, []);

  const api = useMemo(() => {
    const onUpdateUserAvatarScales = (scales: UserAvatarScale[]) =>
      dispatch({ type: "updateUserAvatarScales", scales: scales });
    const onUpdateUserAchievements = (achievements: string[]) =>
      dispatch({ type: "updateUserAchievements", achievements: achievements });

    return { onUpdateUserAvatarScales, onUpdateUserAchievements };
  }, []);

  return (
    <UserGalleryAPIContext.Provider value={api}>
      <UserGalleryDataContext.Provider value={state}>
        {children}
      </UserGalleryDataContext.Provider>
    </UserGalleryAPIContext.Provider>
  );
};

export const useUserGalleryData = () => useContext(UserGalleryDataContext);
// TODO: fix stub
export const useUserGalleryAPI = () => useContext(UserGalleryAPIContext);
