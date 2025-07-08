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

const UserGalleryAvatarContext = createContext<State["userAvatarScales"]>(
  {} as State["userAvatarScales"]
);
const UserGalleryAchievementsContext = createContext<State["userAchievements"]>(
  {} as State["userAchievements"]
);

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
export const UserGalleryProvider = ({ children }: Provider) => {
  const [state, dispatch] = useReducer(reducer, {
    userAvatarScales: [],
    userAchievements: [],
  });

  const api = useMemo(() => {
    const onUpdateUserAvatarScales = (scales: UserAvatarScale[]) =>
      dispatch({ type: "updateUserAvatarScales", scales: scales });
    const onUpdateUserAchievements = (achievements: string[]) =>
      dispatch({ type: "updateUserAchievements", achievements: achievements });

    return { onUpdateUserAvatarScales, onUpdateUserAchievements };
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch("/users/avatars");
      const result = await res.json();

      api.onUpdateUserAvatarScales(result);
      // dispatch({ type: "updateUserAvatarScales", scales: result });
    };

    fetchUsers();
  }, []);

  return (
    <UserGalleryAPIContext.Provider value={api}>
      <UserGalleryAvatarContext.Provider value={state.userAvatarScales}>
        <UserGalleryAchievementsContext.Provider value={state.userAchievements}>
          {children}
        </UserGalleryAchievementsContext.Provider>
      </UserGalleryAvatarContext.Provider>
    </UserGalleryAPIContext.Provider>
  );
};

export const useUserGalleryAvatars = () => useContext(UserGalleryAvatarContext);
export const useUserGalleryAchievements = () =>
  useContext(UserGalleryAchievementsContext);
export const useUserGalleryAPI = () => useContext(UserGalleryAPIContext);
