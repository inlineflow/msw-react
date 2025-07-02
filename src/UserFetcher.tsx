import { useGalleryContext } from "./UserGalleryContext";
import type { UserAvatarScale } from "../types/user";

export const UserFetcher = () => {
  const { setUserAvatarScales } = useGalleryContext();

  const handleNewUsers = () => {
    const fetchUsers = async () => {
      const res = await fetch("/users/avatars");
      const result = (await res.json()) as UserAvatarScale[];

      setUserAvatarScales(result);
    };

    fetchUsers();
  };

  return (
    <div>
      <button onClick={handleNewUsers}>New Users</button>
    </div>
  );
};
