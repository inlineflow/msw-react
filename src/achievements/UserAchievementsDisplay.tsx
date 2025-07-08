import { useUserGalleryAchievements } from "../UserGalleryContext";

export const UserAchievementsDisplay = () => {
  const userAchievements = useUserGalleryAchievements();
  return (
    <div>
      {userAchievements.map((a) => (
        <li key={a}>{a}</li>
      ))}
    </div>
  );
};
