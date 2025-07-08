import { useCallback, useEffect } from "react";
import { useUserGalleryAPI, useUserGalleryData } from "./UserGalleryContext";

export const UserAchievementsDisplay = () => {
  const { userAchievements } = useUserGalleryData();
  return (
    <div>
      {userAchievements.map((a) => (
        <li key={a}>{a}</li>
      ))}
    </div>
  );
};

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
      <button onClick={fetchAchievements}>Refresh Achievements</button>
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
