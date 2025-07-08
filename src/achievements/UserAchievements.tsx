import { useCallback, useEffect } from "react";
import { useUserGalleryAPI } from "../UserGalleryContext";
import { UserAchievementsDisplay } from "./UserAchievementsDisplay";

export const UserAchievementsFetcher = () => {
  const { onUpdateUserAchievements } = useUserGalleryAPI();

  const fetchAchievements = useCallback(async () => {
    const resp = await fetch("/users/achievements");
    const result = (await resp.json()) as string[];

    onUpdateUserAchievements(result);
  }, []);

  useEffect(() => {
    fetchAchievements();
  }, []);

  return (
    <div>
      <button onClick={() => fetchAchievements()}>Refresh Achievements</button>
    </div>
  );
};

export const UserAchievements = () => {
  return (
    <div>
      <UserAchievementsDisplay />
      <UserAchievementsFetcher />
    </div>
  );
};
