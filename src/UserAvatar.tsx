import type { UserAvatarScale } from "../types/user";
// import { useGalleryContext } from "./UserGalleryContext";

type UserAvatarProps = {
  scale: UserAvatarScale;
};
export const UserAvatar = ({ scale }: UserAvatarProps) => {
  // const { userAvatarScales, setUserAvatarScales } = useGalleryContext();
  return <p>{scale}</p>;
};
