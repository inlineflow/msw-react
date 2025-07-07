import { UserAvatar } from "./UserAvatar";
import { UserFetcher } from "./UserFetcher";
import { useUserGalleryData } from "./UserGalleryContext";

export const UserGallery = () => {
  const { userAvatarScales } = useUserGalleryData();

  return (
    <div>
      <ul>
        {userAvatarScales?.map((scale, i) => (
          <li key={i}>
            <UserAvatar scale={scale} />
          </li>
        ))}
      </ul>
      <UserFetcher />
    </div>
  );
};
