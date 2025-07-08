import { UserAvatar } from "./UserAvatar";
import { useUserGalleryAvatars } from "./UserGalleryContext";

export const UserGallery = () => {
  const userAvatarScales = useUserGalleryAvatars();

  return (
    <div>
      <ul>
        {userAvatarScales?.map((scale, i) => (
          <li key={i}>
            <UserAvatar scale={scale} />
          </li>
        ))}
      </ul>
    </div>
  );
};
