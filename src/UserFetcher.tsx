import { useUserGalleryAPI } from "./UserGalleryContext";
import type { UserAvatarScale } from "../types/user";

export const UserFetcher = () => {
  const { onUpdateUserAvatarScales } = useUserGalleryAPI();

  const handleNewUsers = () => {
    const fetchUsers = async () => {
      const res = await fetch("/users/avatars");
      const result = (await res.json()) as UserAvatarScale[];

      onUpdateUserAvatarScales(result);
    };

    fetchUsers();
  };

  return (
    <div>
      <button onClick={handleNewUsers}>New Users</button>
    </div>
  );
};
