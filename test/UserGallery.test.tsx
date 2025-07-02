import { render } from "@testing-library/react";
import { describe, test } from "vitest";
import { UserGalleryProvider } from "../src/UserGalleryContext";
import { UserGallery } from "../src/UserGallery";

describe("UserGallery", () => {
  test("renders all fetched UserAvatars", () => {
    render(
      <UserGalleryProvider>
        <UserGallery />
      </UserGalleryProvider>
    );
  });
});
