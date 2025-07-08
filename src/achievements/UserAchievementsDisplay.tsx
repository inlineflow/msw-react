import { useUserGalleryData } from "../UserGalleryContext";

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
