import { UserFetcher } from "./UserFetcher";
import { UserGallery } from "./UserGallery";
import { UserGalleryProvider } from "./UserGalleryContext";

export const UserPage = () => {
  return (
    <div>
      <UserGalleryProvider>
        <UserGallery />
        <UserFetcher />;
      </UserGalleryProvider>
    </div>
  );
};
