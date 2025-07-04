import { UserAvatar } from "./UserAvatar";
import { UserFetcher } from "./UserFetcher";
import { useGalleryContext } from "./UserGalleryContext";

export const UserGallery = () => {
  const { userAvatarScales } = useGalleryContext();

  return (
    <div>
      <ul>
        {userAvatarScales.map((scale) => (
          <li>
            <UserAvatar scale={scale} />
          </li>
        ))}
      </ul>
      <UserFetcher />
    </div>
  );
};
