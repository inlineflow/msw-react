import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { UserGalleryDataProvider } from "../src/UserGalleryContext";
import { UserGallery } from "../src/UserGallery";
import { UserAvatar } from "../src/UserAvatar";

vi.mock("../src/UserAvatar", () => ({
  UserAvatar: vi.fn(() => <div id="UserAvatar"></div>),
}));

describe("UserGallery", () => {
  test("renders all fetched UserAvatars", async () => {
    render(
      <UserGalleryDataProvider>
        <UserGallery />
      </UserGalleryDataProvider>
    );

    await waitFor(() => {
      expect(UserAvatar).toHaveBeenCalled();
    });

    await expect(UserAvatar).toHaveBeenCalledTimes(4);
  });

  test("");
});
